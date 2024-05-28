const { Observer } = require('./observer');
const Stock = require('../models/Stock');
const sequelize = require('../sequelize');

class StockObserver extends Observer {
  async update(order) {
    const transaction = await sequelize.transaction();
    try {
      for (let modelo of order.modelos) {
        const stock = await Stock.findOne({ where: { modelo_id: modelo.modelo_id }, transaction });
        if (stock) {
          if (stock.cantidad_disponible < modelo.cantidad) {
            throw new Error(`Stock insuficiente para el modelo: ${modelo.modelo_id}`);
          }
          stock.cantidad_disponible -= modelo.cantidad;
          stock.cantidad_reservada += modelo.cantidad;
          await stock.save({ transaction });
        } else {
          throw new Error(`Stock no encontrado para el modelo: ${modelo.modelo_id}`);
        }
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = StockObserver;
