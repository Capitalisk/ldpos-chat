module.exports = {
  init: (agServer, knex) => {
    agServer.setMiddleware(
      agServer.MIDDLEWARE_INBOUND,
      async (middlewareStream) => {
        for await (const action of middlewareStream) {
          (async () => {
            if (action.type === action.PUBLISH_IN) {
              // TODO: Handle channel and store messages
              const data = {
                ...action.data,
                ownerId: action.socket.authToken.id,
                channelId: action.channel,
              };

              try {
                await knex('messages').insert(data);
              } catch (e) {
                console.error(e);
                action.block(e);
              }

              // TODO: Fix this
              action.data = {
                ...data,
                createdAt: new Date(),
                username: action.socket.authToken.username,
              };
            }

            console.log(action.data);

            action.allow();
          })();
        }
      },
    );
  },
};
