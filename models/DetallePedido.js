const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Modelo = require('./Modelo');

const DetallePedido = sequelize.define('DetallePedido', {
  detalle_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  pedido_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'pedidos',
      key: 'pedido_id',
    },
  },
  modelo_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Modelo,
      key: 'modelo_id',
    },
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'detalles_pedido',
  timestamps: false,
});

module.exports = DetallePedido;
