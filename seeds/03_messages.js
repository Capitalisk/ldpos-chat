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
          message: faker.lorem.words,
          from_user_id: users[fromRandomNumber].id,
          to_random_user: users[toRandomNumber].id,
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

      return knex('messages').insert(entries);
    });
};
