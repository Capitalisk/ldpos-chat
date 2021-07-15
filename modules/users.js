const attach = (agServer, socket, knex) => {
  (async () => {
    for await (const request of socket.procedure('users/channels')) {
      try {
        const channels = await knex('usersChannels')
          .select('*')
          .leftJoin('users', 'usersChannels.userId', 'users.id')
          .leftJoin('channels', 'usersChannels.channelId', 'channels.id')
          .where({
            userId: request.data.id,
          });

        request.end(channels);
      } catch (e) {
        console.log(e)
        request.end(e);
      }
    }
  })();

  (async () => {
    for await (const request of socket.procedure('users/friends')) {
      try {
        const users = await knex('userFriends')
          .select('*')
          .where({ userId: socket.authToken.id })
          .leftJoin('users', 'userFriends.friendId', 'users.id');

        request.end(users);
      } catch (e) {
        console.log(e);
        request.end(e);
      }
    }
  })();
};

exports.attach = attach;
