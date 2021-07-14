const SOCKETCLUSTER_LOG_LEVEL = process.env.SOCKETCLUSTER_LOG_LEVEL || 2;

module.exports = {
  init: (agServer) => {
    if (SOCKETCLUSTER_LOG_LEVEL >= 1) {
      (async () => {
        for await (let { error } of agServer.listener('error')) {
          console.error(error);
        }
      })();
    }

    if (SOCKETCLUSTER_LOG_LEVEL >= 2) {
      console.log(
        `[Active] SocketCluster worker with PID ${process.pid} is listening on port ${process.env.SOCKETCLUSTER_PORT}`,
      );

      (async () => {
        for await (let { warning } of agServer.listener('warning')) {
          console.warn(warning);
        }
      })();
    }
  },
};
