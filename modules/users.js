const attach = (agServer, socket, knex) => {
  (async () => {
    for await (const request of socket.procedure('users/channels')) {
      try {
        const channels = await knex
          .select('*')
          // .select([
          //   'channels.id',
          //   'channels.name',
          //   knex.raw('ARRAY_AGG(messages.*)'),
          // ])
          .from('usersChannels')
          .leftJoin('users', 'usersChannels.userId', 'users.id')
          .leftJoin('channels', 'usersChannels.channelId', 'channels.id')
          // TODO: This should return the unread messages
          // This should ideally be done by getting the usersChannels, followed by the messages
          // Somehow I need to compare these against userReadMessages
          // Left join messages, and count userReadMessages where userId = request.data.id
          .join('messages', 'messages.channelId', 'channels.id')
          // .innerJoin(
          //   knex
          //     .count('userReadMessages.id')
          //     .from('userReadMessages')
          //     .where({ userId: request.data.id })
          //     .andWhere({ messageId: 'messages.id' }),
          // )
          // .innerJoin(
          //   knex
          //     .count('userReadMessages.id')
          //     .as('readMessageCount')
          //     .from('userReadMessages')
          //     .where({ userId: request.data.id }),
          // )
          // .innerJoin(
          //   knex
          //     .count('messages.id')
          //     .as('messageCount')
          //     .from('channels')
          //     .leftJoin('messages', 'messages.channelId', 'channels.id'),
          // )
          .where({
            userId: request.data.id,
          });

        console.log(channels.toSQL())

        request.end(channels);
      } catch (e) {
        console.log(e);
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
