exports.up = function (knex) {
  return knex.schema.createTable('messages', (table) => {
    table.uuid('id').primary();
    table.string('message').notNullable();

    table
      .uuid('from_user_id')
      .references('id')
      .inTable('users')
      .nullable()
      .onDelete('cascade');

    table
      .uuid('owner_id')
      .references('id')
      .inTable('users_channels')
      .onDelete('cascade');

    table
      .uuid('channel_id')
      .references('id')
      .inTable('channels')
      .nullable()
      .onDelete('cascade');

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('messages');
};
