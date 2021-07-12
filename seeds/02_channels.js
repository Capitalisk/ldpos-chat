const uuidv4 = require('uuid').v4;
const faker = require('faker');

const ENV =
  process.env.NODE_ENV === 'development'
    ? require('../env.development.json')
    : require('../env.production.json');

exports.seed = function (knex) {
  return knex('channels')
    .del()
    .then(async function () {
      const entries = [];

      for (let i = 0; i < ENV.DB.ENTRY_COUNT_PER_TABLE; i++) {
        const randomNumber = Math.floor(
          Math.random() * ENV.DB.ENTRY_COUNT_PER_TABLE,
        );
        const users = await knex('users').select('*');

        entries.push({
          id: uuidv4(),
          channel: faker.lorem.word,
          user_id: users[randomNumber].id,
        });
      }

      return knex('channels').insert(entries);
    });
};
