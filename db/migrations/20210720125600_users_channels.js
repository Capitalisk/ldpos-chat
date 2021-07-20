exports.up = function (knex) {
  return knex.schema.createTable('usersChannels', (table) => {
    table.uuid('userId').references('id').inTable('users').onDelete('cascade');
    table
      .uuid('channelId')
      .references('id')
      .inTable('channels')
      .onDelete('cascade');

    table.timestamp('deletedAt').nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('usersChannels');
};
