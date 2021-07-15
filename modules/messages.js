const sortByDate = (a, b) => {
  a = new Date(a);
  b = new Date(b);

  if (a < b) return 1;
  else return -1;
};

const attach = (agServer, socket, knex) => {
  (async () => {
    for await (const request of socket.procedure('messages/private')) {
      const messages = await knex('messages')
        .select('*')
        .where({ toUserId: request.data.id })
        .orWhere({ ownerId: request.data.id })
        .leftJoin('users', 'messages.ownerId', 'users.id');

      request.end(messages.sort(sortByDate));
    }
  })();

  (async () => {
    for await (const request of socket.procedure('messages/channel')) {
      const messages = await knex('messages')
        .select('*')
        .where({ channelId: request.data.id })
        .leftJoin('users', 'messages.ownerId', 'users.id');

      request.end(messages.sort(sortByDate));
    }
  })();
};

exports.attach = attach;
