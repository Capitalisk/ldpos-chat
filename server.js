const http = require('http');
const eetase = require('eetase');
const socketClusterServer = require('socketcluster-server');
const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const morgan = require('morgan');
const uuid = require('uuid');
const sccBrokerClient = require('scc-broker-client');
const middlewares = require('./system/middlewares');
const logger = require('./system/logger');
const fs = require('fs');
const SCC_INSTANCE_ID = uuid.v4();

process.env = {
  ...process.env,
  ...(process.env.NODE_ENV === 'development'
    ? require('./env.development.json')
    : require('./env.production.json')),
};

const knex = require('knex')(
  process.env.NODE_ENV === 'development'
    ? {
        client: 'sqlite3',
        connection: {
          filename: './dev.sqlite3',
        },
      }
    : {
        client: 'pg',
        connection: {
          host: '127.0.0.1',
          user: 'your_database_user',
          password: 'your_database_password',
          database: 'myapp_test',
        },
      },
);

let agOptions = {};

if (process.env.SOCKETCLUSTER_OPTIONS) {
  let envOptions = JSON.parse(process.env.SOCKETCLUSTER_OPTIONS);
  Object.assign(agOptions, envOptions);
}

let httpServer = eetase(http.createServer());
let agServer = socketClusterServer.attach(httpServer, agOptions);

// Initialize middlewares
middlewares.init(agServer);

let expressApp = express();
if (process.env.NODE_ENV === 'development') {
  // Log every HTTP request. See https://github.com/expressjs/morgan for other
  // available formats.
  expressApp.use(morgan('dev'));
}
expressApp.use(serveStatic(path.resolve(__dirname, 'public')));

// Add GET /health-check express route
expressApp.get('/health-check', (req, res) => {
  res.status(200).send('OK');
});

// HTTP request handling loop.
(async () => {
  for await (const requestData of httpServer.listener('request')) {
    expressApp.apply(null, requestData);
  }
})();

// SocketCluster/WebSocket connection handling loop.
(async () => {
  for await (const { socket } of agServer.listener('connection')) {
    fs.readdir('./modules', null, (err, modules) => {
      if (err) throw new Error(err);
      if (!modules) return;
      console.log(modules);
      for (let i = 0; i < modules.length; i++) {
        const m = modules[i];
        require(`./modules/${m}`).attach(agServer, socket, knex);
      }
    });

    // TODO: Handle channel names for specific user
    // TODO: Handle history for opened channel
    // TODO:
    // (async () => {
    //   for await (const request of socket.procedure('development/user')) {
    //     if (process.env.NODE_ENV !== 'development') return;
    //     const users = await knex('users').select('*');
    //     console.log(users[0]);
    //     request.end(users[0].id);
    //   }
    // })();

    (async () => {
      for await (const request of socket.procedure('users')) {
        const users = await knex('users').select('*');
        console.log(users);
        request.end(users);
      }
    })();

    (async () => {
      for await (const request of socket.procedure('channels/messages')) {
        console.log(request.data.id);

        const messages = await knex('messages')
          .select('*')
          .where({ channelId: request.data.id })
          .leftJoin('users', 'messages.ownerId', 'users.id');

        console.log(messages);
        request.end(messages);
      }
    })();

    (async () => {
      for await (const request of socket.procedure('channels/user')) {
        const channels = await knex('usersChannels')
          .select('*')
          .leftJoin('users', 'usersChannels.userId', 'users.id')
          .leftJoin('channels', 'usersChannels.channelId', 'channels.id')
          .where({
            userId: request.data.id,
          });
        console.log(channels);
        request.end(channels);
      }
    })();
  }
})();

httpServer.listen(process.env.SOCKETCLUSTER_PORT);

logger.init(agServer);

if (process.env.SCC_STATE_SERVER_HOST) {
  // Setup broker client to connect to SCC.
  let sccClient = sccBrokerClient.attach(agServer.brokerEngine, {
    instanceId: SCC_INSTANCE_ID,
    instancePort: process.env.SOCKETCLUSTER_PORT,
    instanceIp: process.env.SCC_INSTANCE_IP,
    instanceIpFamily: process.env.SCC_INSTANCE_IP_FAMILY,
    pubSubBatchDuration: process.env.SCC_PUB_SUB_BATCH_DURATION,
    stateServerHost: process.env.SCC_STATE_SERVER_HOST,
    stateServerPort: process.env.SCC_STATE_SERVER_PORT,
    mappingEngine: process.env.SCC_MAPPING_ENGINE,
    clientPoolSize: process.env.SCC_CLIENT_POOL_SIZE,
    authKey: process.env.SCC_AUTH_KEY,
    stateServerConnectTimeout: process.env.SCC_STATE_SERVER_CONNECT_TIMEOUT,
    stateServerAckTimeout: process.env.SCC_STATE_SERVER_ACK_TIMEOUT,
    stateServerReconnectRandomness:
      process.env.SCC_STATE_SERVER_RECONNECT_RANDOMNESS,
    brokerRetryDelay: process.env.SCC_BROKER_RETRY_DELAY,
  });

  if (SOCKETCLUSTER_LOG_LEVEL >= 1) {
    (async () => {
      for await (let { error } of sccClient.listener('error')) {
        error.name = 'SCCError';
        console.error(error);
      }
    })();
  }
}
