const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const DetalleOrden = require('./DetalleOrden'); // Importa el modelo de DetalleOrden

const OrdenCompra = sequelize.define('OrdenCompra', {
  orden_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  proveedor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
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

OrdenCompra.hasMany(DetalleOrden, { foreignKey: 'orden_id' });
DetalleOrden.belongsTo(OrdenCompra, { foreignKey: 'orden_id' });

module.exports = OrdenCompra;
