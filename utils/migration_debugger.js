const { development } = require('../knexfile')()
const knex = require('knex')(development);
// const {up, down} = require('./migrations/20210720125451_users');
// const {up, down} = require('./migrations/20210720125513_channels');
// const {up, down} = require('./migrations/20210720125600_users_channels');
const {up, down} = require('../migrations/20210720125614_messages');

console.log(up(knex).toSQL());
console.log(down(knex).toSQL());
