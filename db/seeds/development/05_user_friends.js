const uuidv4 = require('uuid').v4;
const faker = require('faker');

const { randomNumber } = require('./lib');

const ENV = require('../../../env.development.json')

exports.seed = function (knex) {
  return knex('userFriends')
    .del()
    .then(async function () {
      const entries = [];

      if (!ENV.SEED.FRIENDS_PER_USER) return;

      const users = await knex('users').select('*');

      for (let i = 0; i < users.length; i++) {
        for (let idx = 0; idx < ENV.SEED.FRIENDS_PER_USER; idx++) {
          entries.push({
            userId: users[randomNumber(ENV.SEED.ENTRY_COUNT_PER_TABLE)].id,
            friendId: users[randomNumber(ENV.SEED.ENTRY_COUNT_PER_TABLE)].id,
          });
        }
      }

      return knex('userFriends').insert(entries);
    });
};
