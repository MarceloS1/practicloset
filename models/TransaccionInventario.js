const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const TransaccionInventario = sequelize.define('TransaccionInventario', {
  transaccion_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  producto_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'productos',
      key: 'producto_id',
    },
    allowNull: false,
  },
  tipo_transaccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_transaccion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  nota: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'transacciones_inventario',
  timestamps: false,
});

module.exports = TransaccionInventario;
