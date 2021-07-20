exports.up = function (knex) {
  return knex.schema.createTable('channels', (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.uuid('ownerId').references('id').inTable('users').onDelete('cascade');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    table.timestamp('deletedAt').nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('channels');
};
