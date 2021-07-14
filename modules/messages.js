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

      console.log(messages);
      request.end(messages.sort(sortByDate));
    }
  })();

  (async () => {
    for await (const request of socket.procedure('messages/channel')) {
      console.log(request.data.id);

      const messages = await knex('messages')
        .select('*')
        .where({ channelId: request.data.id })
        .leftJoin('users', 'messages.ownerId', 'users.id');

      console.log(messages);
      request.end(messages.sort(sortByDate));
    }
  })();
};

exports.attach = attach;
