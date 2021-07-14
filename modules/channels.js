const attach = (agServer, socket, knex) => {
  (async () => {
    for await (const request of socket.procedure('user/channel')) {
      console.log(request.data.id);

      const channels = await knex('usersChannels')
        .select('*')
        .leftJoin('users', 'usersChannels.userId', 'users.id')
        .leftJoin('channels', 'usersChannels.channelId', 'channels.id')
        .where({
          userId: request.data.id,
        });
      console.log(channels);
      request.end(channels);
    }
  })();
};

exports.attach = attach;
