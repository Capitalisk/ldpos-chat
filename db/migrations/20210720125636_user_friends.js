exports.up = function (knex) {
  return knex.schema.createTable('userFriends', (table) => {
    table.uuid('userId').references('id').inTable('users').onDelete('cascade');
    table
      .uuid('friendId')
      .references('id')
      .inTable('users')
      .onDelete('cascade');

    table.timestamp('deletedAt').nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('userFriends');
};
