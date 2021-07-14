exports.up = function (knex) {
  return knex.schema.createTable('messages', (table) => {
    table.uuid('id').primary();
    table.string('message').notNullable();

    table
      .uuid('fromUserId')
      .references('id')
      .inTable('users')
      .nullable()
      .onDelete('cascade');

    table
      .uuid('ownerId')
      .references('id')
      .inTable('usersChannels')
      .onDelete('cascade');

    table
      .uuid('channelId')
      .references('id')
      .inTable('channels')
      .nullable()
      .onDelete('cascade');

    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('messages');
};
