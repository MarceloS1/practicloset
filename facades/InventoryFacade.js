const Stock = require('../models/Stock');
const TransaccionInventario = require('../models/TransaccionInventario');
const sequelize = require('../sequelize');
const TransaccionInventarioBuilder = require('../builders/transaccionInventarioBuilder');

class InventoryFacade {
    async addTransactionAndUpdateStock({ modelo_id, tipo_transaccion, cantidad, nota }) {
        const transaction = await sequelize.transaction();

        try {
            // Verificar stock actual si es una salida
            if (tipo_transaccion === 'salida') {
                const stock = await Stock.findOne({ where: { modelo_id }, transaction });

                if (!stock || stock.cantidad_disponible < cantidad) {
                    await transaction.rollback();
                    throw new Error('No hay suficiente stock disponible para esta transacción');
                }
            }

            // Build the inventory transaction
            const transaccionData = new TransaccionInventarioBuilder()
                .setModeloId(modelo_id)
                .setTipoTransaccion(tipo_transaccion)
                .setCantidad(cantidad)
                .setNota(nota)
                .build();

            // Insertar transacción de inventario
            const transaccion = await TransaccionInventario.create(transaccionData, { transaction });

            // Actualizar stock
            let stock = await Stock.findOne({ where: { modelo_id }, transaction });
            if (stock) {
                if (tipo_transaccion === 'entrada') {
                    stock.cantidad_disponible += cantidad;
                } else if (tipo_transaccion === 'salida') {
                    stock.cantidad_disponible -= cantidad;
                }
                await stock.save({ transaction });
            }

            await transaction.commit();
            return { transaccion, stock };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = new InventoryFacade();