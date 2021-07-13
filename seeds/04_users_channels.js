const uuidv4 = require('uuid').v4;

const { randomNumber } = require('./lib');

const ENV =
  process.env.NODE_ENV === 'development'
    ? require('../env.development.json')
    : require('../env.production.json');

exports.seed = function (knex) {
  return knex('users_channels')
    .del()
    .then(async function () {
      const entries = [];

      if (!ENV.DB.ENTRY_COUNT_PER_TABLE) return;

      const users = await knex('users').select('*');
      const channels = await knex('channels').select('*');

      for (let idx = 0; idx < users.length; idx++) {
        const user = users[idx];
        for (let i = 0; i < ENV.DB.CHANNEL_USER_COUNT; i++) {
          entries.push({
            id: uuidv4(),
            user_id: user.id,
            channel_id: channels[randomNumber(ENV.DB.ENTRY_COUNT_PER_TABLE)].id,
          });
        }
      }

      return knex('users_channels').insert(entries);
    });
};
