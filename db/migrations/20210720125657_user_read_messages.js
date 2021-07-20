exports.up = function (knex) {
  return knex.schema.createTable('userReadMessages', (table) => {
    table
      .uuid('messageId')
      .references('id')
      .inTable('messages')
      .onDelete('cascade');

    table.uuid('userId').references('id').inTable('users').onDelete('cascade');

    table.timestamp('createdAt').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('userReadMessages');
};
