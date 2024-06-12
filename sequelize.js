const { Sequelize } = require('sequelize');

class Database {
  constructor() {
    if (!Database.instance) {
      this.sequelize = new Sequelize('practicloset_db', 'Marcelo', 'Passw0rd', {
        host: '25.56.40.70',
        dialect: 'postgres',
        port: 5433,
      });
      Database.instance = this;
    }

    return Database.instance;
  }

  getSequelizeInstance() {
    return this.sequelize;
  }
}

const instance = new Database();
Object.freeze(instance);

module.exports = instance.getSequelizeInstance();