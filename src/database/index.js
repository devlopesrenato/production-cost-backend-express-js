
require('dotenv').config();
const knex = require('knex');
const config = require('../../knexfile');

const environment = process.env.NODE_ENV || 'development';

const database = knex(config[environment]);

module.exports = database;