const uuidv4 = require('uuid').v4;
const faker = require('faker');

const { randomNumber } = require('./lib')

const ENV = require('../../../env.development.json')

exports.seed = function (knex) {
  return knex('channels')
    .del()
    .then(async function () {
      const entries = [];

      if (!ENV.SEED.ENTRY_COUNT_PER_TABLE) return;

      const users = await knex('users').select('*');

      for (let i = 0; i < ENV.SEED.ENTRY_COUNT_PER_TABLE; i++) {
        entries.push({
          id: uuidv4(),
          name: faker.lorem.word(),
          ownerId: users[randomNumber(ENV.SEED.ENTRY_COUNT_PER_TABLE)].id,
        });
      }

      return knex('channels').insert(entries);
    });
};
