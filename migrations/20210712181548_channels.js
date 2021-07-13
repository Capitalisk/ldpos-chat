exports.up = function (knex) {
  return knex.schema.createTable('channels', (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.uuid('owner_id').references('id').inTable('users').onDelete('cascade');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('channels');
};
