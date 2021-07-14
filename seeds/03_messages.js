const uuidv4 = require('uuid').v4;
const faker = require('faker');

const { randomNumber } = require('./lib')

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

      const users = await knex('users').select('*');

      // Direct messages
      for (let i = 0; i < ENV.DB.ENTRY_COUNT_PER_TABLE; i++) {
        entries.push({
          id: uuidv4(),
          message: faker.lorem.words(),
          fromUserId: users[randomNumber(ENV.DB.ENTRY_COUNT_PER_TABLE)].id,
          ownerId: users[randomNumber(ENV.DB.ENTRY_COUNT_PER_TABLE)].id,
        });
      }

      return knex('messages').insert(entries);
    })
    .then(async function () {
      const entries = [];

      if (!ENV.DB.ENTRY_COUNT_PER_TABLE) return;

      const users = await knex('users').select('*');
      const channels = await knex('channels').select('*');

      // Channel messages
      for (let i = 0; i < ENV.DB.ENTRY_COUNT_PER_TABLE; i++) {
        entries.push({
          id: uuidv4(),
          message: faker.lorem.words(),
          channelId: channels[randomNumber(ENV.DB.ENTRY_COUNT_PER_TABLE)].id,
          ownerId: users[randomNumber(ENV.DB.ENTRY_COUNT_PER_TABLE)].id,
        });
      }

      return knex('messages').insert(entries);
    });
};
