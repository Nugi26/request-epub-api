// basically, this allows connection configuration to match the current env; development, or production
require("dotenv").config();
// set environment to development or based on .env
const environtment = process.env.NODE_ENV || "development";
// import knex config
const config = require("../../knexfile");
// pick configuration based on the current environment
const environmentConfig = config[environtment];
// import knex module
const knex = require("knex");
// configure knex connection using current environment config
const connect = knex(environmentConfig);
module.exports = connect;
