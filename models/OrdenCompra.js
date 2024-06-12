const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Proveedor = require('./Proveedor');

const OrdenCompra = sequelize.define('OrdenCompra', {
  orden_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  proveedor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Proveedor,
      key: 'proveedor_id',
    },
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'ordenes_compra',
  timestamps: false,
});

module.exports = OrdenCompra;
