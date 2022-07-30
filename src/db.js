const { Pool } = require('pg');

const connectionString = process.env.CONNECTION_STRING;

const db = new Pool({ connectionString });

exports.db = db;