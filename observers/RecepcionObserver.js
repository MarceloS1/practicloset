const { Observer } = require('./observer');
const Stock = require('../models/Stock');
const sequelize = require('../sequelize');

class RecepcionObserver extends Observer {
    async update(orden) {
        const transaction = await sequelize.transaction();
        try {
            for (let detalle of orden.DetalleOrdenes) {
                const stock = await Stock.findOne({ where: { articulo_id: detalle.articulo_id }, transaction });
                if (stock) {
                    stock.cantidad_disponible += detalle.cantidad;
                    await stock.save({ transaction });
                } else {
                    await Stock.create({
                        articulo_id: detalle.articulo_id,
                        cantidad_disponible: detalle.cantidad,
                        cantidad_reservada: 0
                    }, { transaction });
                }
            }
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = RecepcionObserver;
