const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const OrdenCompra = require('./OrdenCompra');
const Articulo = require('./Articulo');

const DetalleOrden = sequelize.define('DetalleOrden', {
  detalle_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orden_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: OrdenCompra,
      key: 'orden_id',
    },
  },
  articulo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Articulo,
      key: 'articulo_id',
    },
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'detalles_orden',
  timestamps: false,
});

module.exports = DetalleOrden;

