const uuidv4 = require('uuid').v4;
const faker = require('faker');

const ENV =
  process.env.NODE_ENV === 'development'
    ? require('../env.development.json')
    : require('../env.production.json');

exports.seed = function (knex) {
  return knex('users')
    .del()
    .then(function () {
      const entries = [];

      if(!ENV.DB.ENTRY_COUNT_PER_TABLE) return
      for (let i = 0; i < ENV.DB.ENTRY_COUNT_PER_TABLE; i++) {
        entries.push({
          id: uuidv4(),
          username: `${faker.name.firstName()}${faker.name.lastName()}`,
          password: faker.internet.password(),
        });
      }

      return knex('users').insert(entries);
    });
};
