const attach = (agServer, socket, knex) => {
  (async () => {
    for await (const request of socket.procedure('user/channel')) {
      const channels = await knex('usersChannels')
        .select('*')
        .leftJoin('users', 'usersChannels.userId', 'users.id')
        .leftJoin('channels', 'usersChannels.channelId', 'channels.id')
        .where({
          userId: request.data.id,
        });

      request.end(channels);
    }
  })();
};

exports.attach = attach;
