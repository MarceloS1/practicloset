const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Stock = sequelize.define('Stock', {
  stock_id: {
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
  cantidad_disponible: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // Valor predeterminado en caso de que no se proporcione
  },
  cantidad_reservada: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // Valor predeterminado en caso de que no se proporcione
  },
}, {
  tableName: 'stock',
  timestamps: false,
});

module.exports = Stock;
