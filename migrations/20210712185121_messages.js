exports.up = function (knex) {
  return knex.schema.createTable('messages', (table) => {
    table.uuid('id').primary();
    table.string('message').notNullable();

    table
      .uuid('toUserId')
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

    table.timestamp('readAt').nullable();

    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    table.timestamp('deletedAt').nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('messages');
};
