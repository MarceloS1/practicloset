const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Proveedor = require('./Proveedor'); 

const Articulo = sequelize.define('Articulo', {
  articulo_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  proveedor_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Proveedor,  
      key: 'proveedor_id',
    },
  },
}, {
  tableName: 'articulos',
  timestamps: false,
});

Proveedor.hasMany(Articulo, { foreignKey: 'proveedor_id' });
Articulo.belongsTo(Proveedor, { foreignKey: 'proveedor_id' });

module.exports = Articulo;
