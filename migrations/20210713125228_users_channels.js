exports.up = function (knex) {
  return knex.schema.createTable('usersChannels', (table) => {
    table.uuid('id').primary();
    table.uuid('userId').references('id').inTable('users').onDelete('cascade');
    table
      .uuid('channelId')
      .references('id')
      .inTable('channels')
      .onDelete('cascade');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('usersChannels');
};
