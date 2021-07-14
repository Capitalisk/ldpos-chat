const attach = (agServer, socket, knex) => {
  (async () => {
    for await (let request of socket.procedure('login')) {
      console.log(
        `Login request from client ${socket.id}. Data: ${request.data.username}`,
      );

      try {
        const user = await knex('users')
          .select('*')
          .where('username', request.data.username)
          .first();

        if (user && user.password === request.data.password) {
          delete user.password;
          socket.setAuthToken(user);
          request.end('Login success');
        } else {
          request.end('Login failed');
        }
      } catch (e) {
        console.error(e);
      }
    }
  })();
};

exports.attach = attach;
