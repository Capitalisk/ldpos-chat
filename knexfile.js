const { spawn, exec } = require('child_process');
const { scripts } = require('./package.json');

const initializeDatabase = () => {
  return new Promise((res, rej) => {
    exec('docker ps', (err, stdout, stderr) => {
      if (err) rej(err);
      if (stderr) rej(stderr);
      if (!stdout.includes('ldpos-chat')) {
        exec(
          `npm run start:postgres:${process.env.NODE_ENV}`,
          (err, stdout) => {
            if (err) rej(err);
            if (stderr) rej(stderr);
            res(stdout);
          },
        );
      } else {
        exec(
          `npm run remove:postgres:${process.env.NODE_ENV}`,
          (err, stdout) => {
            if (err) rej(err);
            if (stderr) rej(stderr);
            res(stdout);
          },
        );
      }
    });
  });
};

module.exports = () => {
  // try {
  //   const output = await initializeDatabase();
  //   console.log(output);
  //   console.log('Docker database initialized!');
  // } catch (e) {
  //   console.error(e);
  // }
  return {
    development: {
      client: 'postgresql',
      connection: {
        database: 'ldpos_chat',
        user: 'ldpos',
        password: 'ldpos',
      },
      pool: {
        min: 2,
        max: 10,
      },
      migrations: {
        tableName: 'knex_migrations',
        directory: './db/migrations',
      },
      seeds: {
        directory: './db/seeds/development',
      },
    },

    staging: {
      client: 'postgresql',
      connection: {
        database: 'my_db',
        user: 'username',
        password: 'password',
      },
      pool: {
        min: 2,
        max: 10,
      },
      migrations: {
        tableName: 'knex_migrations',
      },
    },

    production: {
      client: 'postgresql',
      connection: {
        database: 'my_db',
        user: 'username',
        password: 'password',
      },
      pool: {
        min: 2,
        max: 10,
      },
      migrations: {
        tableName: 'knex_migrations',
      },
    },
  };
};
