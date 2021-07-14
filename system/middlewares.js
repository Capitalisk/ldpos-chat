const history = []

module.exports = {
  init: (agServer) => {
    agServer.setMiddleware(
      agServer.MIDDLEWARE_INBOUND,
      async (middlewareStream) => {
        for await (const action of middlewareStream) {
          if (action.type === action.PUBLISH_IN) {
            // TODO: Handle channel and store messages
            history.push(action.data);
          }
          action.allow();
        }
      },
    );
  },
};
