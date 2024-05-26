const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Pedido = require('./Pedido');

const Pago = sequelize.define('Pago', {
  pago_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  pedido_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Pedido,
      key: 'pedido_id',
    },
  },
  fecha_pago: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  monto: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  metodo_pago: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'pagos',
  timestamps: false,
});

Pedido.hasMany(Pago, { foreignKey: 'pedido_id' });
Pago.belongsTo(Pedido, { foreignKey: 'pedido_id' });

module.exports = Pago;
