const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Modelo = require('./Modelo');

const TransaccionInventario = sequelize.define('TransaccionInventario', {
  transaccion_id: {
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
