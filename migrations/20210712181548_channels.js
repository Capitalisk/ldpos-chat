exports.up = function (knex) {
  return knex.schema.createTable('channels', (table) => {
    table.uuid('id');
    table.string('channel').notNullable();
    table.uuid('user_id').references('id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('channels');
};
