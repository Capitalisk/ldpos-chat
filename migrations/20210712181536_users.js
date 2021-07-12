exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id');
    table.string('name').notNullable();
    table.string('password').notNullable();
    table.string('wallet_address');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
