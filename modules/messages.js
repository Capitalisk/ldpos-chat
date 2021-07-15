const attach = (agServer, socket, knex) => {
  (async () => {
    for await (const request of socket.procedure('messages/private')) {
      const messages = await knex('messages')
        .select('*')
        .where({ toUserId: request.data.id })
        .orWhere({ ownerId: request.data.id })
        .innerJoin('users', 'messages.ownerId', 'users.id')
        .orderBy('createdAt');

      request.end(messages);
    }
  })();

  (async () => {
    for await (const request of socket.procedure('messages/channel')) {
      // users override createdAt of messages. This is a fix for that, see https://github.com/knex/knex/issues/61#issuecomment-139267190
      const messages = await knex('messages')
        .select(['users.*', 'messages.*'])
        .where({ channelId: request.data.id })
        .leftJoin('users', 'messages.ownerId', 'users.id')
        .orderBy('createdAt');

      request.end(messages);
    }
  })();
};

exports.attach = attach;
