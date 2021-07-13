const uuidv4 = require('uuid').v4;
const faker = require('faker');

const ENV =
  process.env.NODE_ENV === 'development'
    ? require('../env.development.json')
    : require('../env.production.json');

exports.seed = function (knex) {
  return knex('messages')
    .del()
    .then(async function () {
      const entries = [];

      if (!ENV.DB.ENTRY_COUNT_PER_TABLE) return;

      // Direct messages
      for (let i = 0; i < ENV.DB.ENTRY_COUNT_PER_TABLE; i++) {
        const fromRandomNumber = Math.floor(
          Math.random() * ENV.DB.ENTRY_COUNT_PER_TABLE,
        );
        const toRandomNumber = Math.floor(
          Math.random() * ENV.DB.ENTRY_COUNT_PER_TABLE,
        );

        const users = await knex('users').select('*');

        entries.push({
          id: uuidv4(),
          message: faker.lorem.words(),
          from_user_id: users[fromRandomNumber].id,
          to_user_id: users[toRandomNumber].id,
        });
      }

      return knex('messages').insert(entries);
    })
    .then(async function () {
      const entries = [];

      if (!ENV.DB.ENTRY_COUNT_PER_TABLE) return;

      // Channel messages
      for (let i = 0; i < ENV.DB.ENTRY_COUNT_PER_TABLE; i++) {
        const randomNumber = Math.floor(
          Math.random() * ENV.DB.ENTRY_COUNT_PER_TABLE,
        );
        const channels = await knex('channels').select('*');

        entries.push({
          id: uuidv4(),
          message: faker.lorem.words(),
          channel_id: channels[randomNumber].id,
        });
      }

      return knex('messages').insert(entries);
    });
};
