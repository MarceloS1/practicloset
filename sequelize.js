const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('practicloset_db', 'Marcelo', 'Passw0rd', {
  host: '25.56.40.70',
  dialect: 'postgres',
  port: 5433,
});

module.exports = sequelize;
