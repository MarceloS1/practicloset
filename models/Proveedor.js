const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const proveedor = sequelize.define('Proveedor', {
  proveedor_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'proveedores',
  timestamps: false,
});

module.exports = proveedor;