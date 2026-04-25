// Update with your config settings.
require('dotenv').config()

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'pg',
    connection: {
      host: process.env.DEV_PG_HOST,
      port: process.env.DEV_PG_PORT,
      database: process.env.DEV_PG_DATABASE,
      user: process.env.DEV_PG_USER,
      password: process.env.DEV_PG_PASSWORD,
      charset: 'utf8'
    }
  },

  staging: {
    client: 'pg',
    connection: {
      host: process.env.TEST_PG_HOST,
      port: process.env.TEST_PG_PORT,
      database: process.env.TEST_PG_DATABASE,
      user: process.env.TEST_PG_USER,
      password: process.env.TEST_PG_PASSWORD,
      charset: 'utf8'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: {
      host: process.env.PRD_PG_HOST,
      port: process.env.PRD_PG_PORT,
      database: process.env.PRD_PG_DATABASE,
      user: process.env.PRD_PG_USER,
      password: process.env.PRD_PG_PASSWORD,
      charset: 'utf8'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
