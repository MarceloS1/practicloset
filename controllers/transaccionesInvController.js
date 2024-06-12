const TransaccionInventario = require('../models/TransaccionInventario');
const Stock = require('../models/Stock');
const ResponseFactory = require('../helpers/responseFactory');
const sequelize = require('../sequelize');

exports.agregarTransaccionYActualizarStock = async (req, res) => {
    const { modelo_id, tipo_transaccion, cantidad, nota } = req.body;

    const transaction = await sequelize.transaction();

    try {
        // Verificar stock actual si es una salida
        if (tipo_transaccion === 'salida') {
            const stock = await Stock.findOne({ where: { modelo_id }, transaction });

            if (!stock || stock.cantidad_disponible < cantidad) {
                await transaction.rollback();
                const respuesta = ResponseFactory.createErrorResponse(new Error('Stock insuficiente'), 'No hay suficiente stock disponible para esta transacción');
                return res.status(respuesta.status).json(respuesta.body);
            }
        }

        // Insertar transacción de inventario
        const transaccion = await TransaccionInventario.create({
            modelo_id,
            tipo_transaccion,
            cantidad,
            nota,
        }, { transaction });

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

        const respuesta = ResponseFactory.createSuccessResponse({ transaccion, stock }, 'Transacción y actualización de stock realizadas con éxito');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        await transaction.rollback();
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al agregar transacción y actualizar stock');
        res.status(respuesta.status).json(respuesta.body);
    }
};