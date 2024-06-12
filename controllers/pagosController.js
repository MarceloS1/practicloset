const Pago = require('../models/Pago');
const Pedido = require('../models/Pedido');
const ResponseFactory = require('../helpers/responseFactory');
const sequelize = require('../sequelize');

// Crear un nuevo pago y actualizar el estado del pedido a "Completado"
exports.crearPago = async (req, res) => {
    const { pedido_id, fecha_pago, metodo_pago } = req.body;

    try {
        const result = await sequelize.transaction(async (t) => {
            // Obtener el precio total del pedido
            const pedido = await Pedido.findByPk(pedido_id, { transaction: t });
            if (!pedido) {
                throw new Error('Pedido no encontrado');
            }
            const monto = pedido.precio_total;

            // Insertar el pago
            const pago = await Pago.create({
                pedido_id,
                fecha_pago,
                monto,
                metodo_pago,
            }, { transaction: t });

            // Actualizar el estado del pedido a "Completado"
            await pedido.update({ estado_pago: 'Completado' }, { transaction: t });

            return { pago, pedido };
        });

        const respuesta = ResponseFactory.createSuccessResponse(result, 'Pago creado y pedido actualizado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al crear el pago y actualizar el pedido');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Obtener todos los pagos
exports.obtenerPagos = async (req, res) => {
    try {
        const pagos = await Pago.findAll();
        const respuesta = ResponseFactory.createSuccessResponse(pagos, 'Pagos obtenidos exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener los pagos');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Actualizar un pago existente
exports.actualizarPago = async (req, res) => {
    const { pagoId } = req.params;
    const { pedido_id, fecha_pago, metodo_pago } = req.body;

    try {
        const pago = await Pago.findByPk(pagoId);
        if (!pago) {
            const respuesta = ResponseFactory.createNotFoundResponse('Pago no encontrado');
            return res.status(respuesta.status).json(respuesta.body);
        }
        await pago.update({
            pedido_id,
            fecha_pago,
            metodo_pago,
        });
        const respuesta = ResponseFactory.createSuccessResponse(pago, 'Pago actualizado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al actualizar el pago');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Eliminar un pago
exports.eliminarPago = async (req, res) => {
    const { pagoId } = req.params;
    try {
        const pago = await Pago.findByPk(pagoId);
        if (!pago) {
            const respuesta = ResponseFactory.createNotFoundResponse('Pago no encontrado');
            return res.status(respuesta.status).json(respuesta.body);
        }
        await pago.destroy();
        const respuesta = ResponseFactory.createSuccessResponse(null, 'Pago eliminado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al eliminar el pago');
        res.status(respuesta.status).json(respuesta.body);
    }
};
