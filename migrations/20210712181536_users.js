exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary();
    table.string('username').notNullable();
    table.string('password').notNullable();
    table.string('walletAddress');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
