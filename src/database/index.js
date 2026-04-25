
require('dotenv').config();
const knex = require('knex');
const config = require('../../knexfile');

const environment = process.env.NODE_ENV || 'development';

const database = knex(config[environment]);

database.raw('SELECT 1')
    .then(() => {
        console.log('Database connection successful');
    })
    .catch((err) => {
        console.error('Database connection failed:', err);
        process.exit(1);
    });


module.exports = database;