const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Trabajador = sequelize.define('Trabajador', {
  trabajador_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cedula: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cargo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha_ingreso: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  salario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'trabajadores',
  timestamps: false,
});

module.exports = Trabajador;
