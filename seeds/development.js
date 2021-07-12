const uuidv4 = require('uuid').v4;
const faker = require('faker');

const ENV =
  process.env === 'development'
    ? require('../env.development.json')
    : require('../env.production.json');

exports.seed = function (knex) {
  knex('users')
    .del()
    .then(() => {
      const entries = [];

      for (let i = 0; i < ENV.DB.ENTRY_COUNT_PER_TABLE; i++) {
        entries.push({
          id: uuidv4(),
          username: `${faker.name.firstName()}${faker.name.lastName()}`,
          password: faker.internet.password,
        });
      }

      return knex('users').insert(entries);
    });

  knex('channels')
    .del()
    .then(async () => {
      const entries = [];

      for (let i = 0; i < ENV.DB.ENTRY_COUNT_PER_TABLE; i++) {
        const randomNumber = Math.floor(
          Math.random() * ENV.DB.ENTRY_COUNT_PER_TABLE,
        );
        const randomUser = await knex('users').select('*')[randomNumber];

        entries.push({
          id: uuidv4(),
          channel: faker.lorem.word,
          user_id: randomUser.id,
        });
      }

      return knex('channels').insert(entries);
    });

  knex('message')
    .del()
    .then(async () => {
      const entries = [];

      // Direct messages
      for (let i = 0; i < ENV.DB.ENTRY_COUNT_PER_TABLE; i++) {
        const randomNumber = Math.floor(
          Math.random() * ENV.DB.ENTRY_COUNT_PER_TABLE,
        );
        const fromRandomUser = await knex('users').select('*')[randomNumber];
        const toRandomUser = await knex('users').select('*')[randomNumber];

        entries.push({
          id: uuidv4(),
          message: faker.lorem.words,
          from_user_id: fromRandomUser.id,
          to_random_user: toRandomUser.id,
        });
      }

      // Channel messages
      for (let i = 0; i < ENV.DB.ENTRY_COUNT_PER_TABLE; i++) {
        const randomNumber = Math.floor(
          Math.random() * ENV.DB.ENTRY_COUNT_PER_TABLE,
        );
        const randomChannel = await knex('channel').select('*')[randomNumber];

        entries.push({
          id: uuidv4(),
          message: faker.lorem.words,
          channel_id: randomChannel.id,
        });
      }

      return knex('message').insert(entries);
    });
};
