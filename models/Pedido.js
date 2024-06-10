const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const DetallePedido = require('./DetallePedido'); // Importa el modelo DetallePedido

const Pedido = sequelize.define('Pedido', {
  pedido_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_entrega: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  estado_pago: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  precio_total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  estado_entrega: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pendiente',
  },
}, {
  tableName: 'pedidos',
  timestamps: false,
});



module.exports = Pedido;
