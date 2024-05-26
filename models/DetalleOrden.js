const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Articulo = require('../models/articulo'); 

const DetalleOrden = sequelize.define('DetalleOrden', {
  detalle_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orden_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'ordenes_compra',
      key: 'orden_id',
    },
  },
  articulo_id: {
    type: DataTypes.INTEGER,
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
