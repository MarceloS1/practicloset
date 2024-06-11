
const { Observer } = require('./observer');
const Stock = require('../models/Stock');
const sequelize = require('../sequelize');

class EntregaObserver extends Observer {
  async update(pedido) {
    const transaction = await sequelize.transaction();
    try {
      for (let detalle of pedido.DetallePedidos) {
        const stock = await Stock.findOne({ where: { modelo_id: detalle.modelo_id }, transaction });
        if (stock) {
          stock.cantidad_reservada -= detalle.cantidad;
          await stock.save({ transaction });
        } else {
          throw new Error(`Stock no encontrado para el modelo: ${detalle.modelo_id}`);
        }
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = EntregaObserver;
