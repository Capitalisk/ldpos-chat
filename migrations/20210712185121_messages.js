exports.up = function (knex) {
  return knex.schema.createTable('messages', (table) => {
    table.uuid('id');
    table.string('message').notNullable();
    table.uuid('from_user_id').references('id').inTable('users').nullable();
    table.uuid('channel_id').references('id').inTable('channels').nullable();
    table.uuid('to_user_id').references('id').inTable('users').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('messages');
};
