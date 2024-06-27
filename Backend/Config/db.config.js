// Exporting configuration settings for database connection
module.exports = {
  // Database host URL, retrieved from environment variables
  HOST: process.env.HOST,

  // Database user name, retrieved from environment variables
  USER: process.env.USER,

  // Database password, retrieved from environment variables
  PASSWORD: process.env.PASSWORD,

  // Database name, retrieved from environment variables
  DB: process.env.DB,

  // Database dialect (type of database), hardcoded as 'postgres'
  dialect: "postgres",

  // Configuration settings for the connection pool
  pool: {
    // Maximum number of connections in pool
    max: 5,

    // Minimum number of connections in pool
    min: 0,

    // Maximum time, in milliseconds, that pool will try to get connection before throwing error
    acquire: 30000,

    // Maximum time, in milliseconds, that a connection can be idle before being released
    idle: 10000
  }
};
