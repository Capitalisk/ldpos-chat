const uuidv4 = require('uuid').v4;

const { randomNumber } = require('./lib');

const ENV = require('../../../env.development.json')

exports.seed = function (knex) {
  return knex('userReadMessages')
    .del()
    .then(async function () {
      const entries = [];

      if (!ENV.SEED.READ_MESSAGES_PER_USER) return;

      const messages = await knex('messages').select('*');
      const users = await knex('users').select('*');

      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        for (let idx = 0; idx < ENV.SEED.READ_MESSAGES_PER_USER; idx++) {
          entries.push({
            userId: user.id,
            messageId: messages[randomNumber(messages.length - 1)].id,
          });
        }
      }

      return knex('userReadMessages').insert(entries);
    });
};
