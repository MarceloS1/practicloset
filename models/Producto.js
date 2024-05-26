const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Stock = require('./Stock');

const Producto = sequelize.define('Producto', {
  producto_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoria_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'productos',
  timestamps: false,
});

Producto.hasOne(Stock, { foreignKey: 'producto_id' });
Stock.belongsTo(Producto, { foreignKey: 'producto_id' });

module.exports = Producto;
