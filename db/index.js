const { Sequelize } = require('sequelize');
require("dotenv").config();
const sequelize = new Sequelize(process.env.MYSQL_URI, {
  dialect: 'mysql',
  logging: console.log,
});

module.exports = sequelize;
