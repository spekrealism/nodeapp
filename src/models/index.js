const { Sequelize } = require('sequelize');
const dbConfig = require('../../config/database');

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool
  }
);

const db = {
  Sequelize,
  sequelize
};

// Подключаем модели
db.User = require('./user.model')(sequelize, Sequelize);

module.exports = db; 