const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Modelo = require('./Modelo');

const Stock = sequelize.define('Stock', {
  stock_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  modelo_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Modelo,
      key: 'modelo_id',
    },
    allowNull: false,
    onDelete: 'CASCADE',
  },
  cantidad_disponible: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  cantidad_reservada: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'stock',
  timestamps: false,
});


module.exports = Stock;

