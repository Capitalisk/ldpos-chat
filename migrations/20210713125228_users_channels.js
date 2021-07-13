exports.up = function (knex) {
  return knex.schema.createTable('users_channels', (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').references('id').inTable('users').onDelete('cascade');
    table
      .uuid('channel_id')
      .references('id')
      .inTable('channels')
      .onDelete('cascade');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users_channels');
};
