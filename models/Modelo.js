const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Modelo = sequelize.define('Modelo', {
  modelo_id: {
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
  material: {
    type: DataTypes.STRING,
    allowNull: true,  // Puede ser NULL para algunos modelos
  },
  alto: {
    type: DataTypes.FLOAT,
    allowNull: true,  // Puede ser NULL para algunos modelos
  },
  ancho: {
    type: DataTypes.FLOAT,
    allowNull: true,  // Puede ser NULL para algunos modelos
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  imagen_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'modelos',
  timestamps: false,
});

module.exports = Modelo;
