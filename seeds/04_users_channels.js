const uuidv4 = require('uuid').v4;

const { randomNumber } = require('./lib');

const ENV =
  process.env.NODE_ENV === 'development'
    ? require('../env.development.json')
    : require('../env.production.json');

exports.seed = function (knex) {
  return knex('usersChannels')
    .del()
    .then(async function () {
      const entries = [];

      if (!ENV.SEED.ENTRY_COUNT_PER_TABLE) return;

      const users = await knex('users').select('*');
      const channels = await knex('channels').select('*');

      for (let idx = 0; idx < users.length; idx++) {
        const user = users[idx];
        for (let i = 0; i < ENV.SEED.ENTRY_COUNT_PER_TABLE; i++) {
          entries.push({
            id: uuidv4(),
            userId: user.id,
            channelId: channels[randomNumber(ENV.SEED.ENTRY_COUNT_PER_TABLE)].id,
          });
        }
      }

      return knex.batchInsert(
        'usersChannels',
        entries,
        ENV.SEED.ENTRY_COUNT_PER_TABLE,
      );
    });
};
