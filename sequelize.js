require('dotenv').config();
const { Sequelize } = require('sequelize');

class Database {
  constructor() {
    if (!Database.instance) {
      this.sequelize = new Sequelize(process.env.DATABASEURL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
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
