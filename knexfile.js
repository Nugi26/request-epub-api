require('dotenv').config();
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'nugie',
      password: 'nuganteng',
      database: 'request-epub',
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
  },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // }
};
