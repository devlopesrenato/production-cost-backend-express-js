require('dotenv').config();
const knex = require('knex');

const config = {
    client: 'pg',
    connection: process.env.CONNECTION_STRING,
};

const database = knex(config);

module.exports = database;
