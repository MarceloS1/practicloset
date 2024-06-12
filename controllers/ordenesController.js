const sequelize = require('../sequelize');
const OrdenCompra = require('../models/OrdenCompra');
const DetalleOrden = require('../models/DetalleOrden');
const Articulo = require('../models/articulo');
const Stock = require('../models/Stock');
const ResponseFactory = require('../helpers/responseFactory');

// Crear una nueva orden de compra
exports.crearOrden = async (req, res) => {
    const { proveedor_id, fecha, estado, detalles } = req.body;

    const transaction = await sequelize.transaction();

    try {
        // Crear la orden
        const orden = await OrdenCompra.create({
            proveedor_id,
            fecha,
            estado
        }, { transaction });

        // Crear los detalles de la orden
        const detallesOrden = detalles.map(detalle => ({
            orden_id: orden.orden_id,  // Corregir esta referencia
            articulo_id: detalle.articulo_id,
            cantidad: detalle.cantidad
        }));

        await DetalleOrden.bulkCreate(detallesOrden, { transaction });

        await transaction.commit();

        const respuesta = ResponseFactory.createSuccessResponse(orden, 'Orden de compra y detalles creados exitosamente');
        res.status(respuesta.status).json(respuesta.body);

    } catch (error) {
        await transaction.rollback();
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al crear la orden de compra y los detalles');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Obtener todas las órdenes
exports.obtenerOrdenes = async (req, res) => {
    try {
        const ordenes = await OrdenCompra.findAll({
            include: [{
                model: DetalleOrden,
                include: [Articulo]
            }]
        });

        const respuesta = ResponseFactory.createSuccessResponse(ordenes, 'Órdenes obtenidas exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener las órdenes');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Actualizar una orden existente
exports.actualizarOrden = async (req, res, next) => {
    const { ordenId } = req.params;
    const { proveedor_id, fecha, estado, detalles } = req.body;

    try {
        const result = await sequelize.transaction(async (t) => {
            // Actualizar la orden
            const orden = await OrdenCompra.findByPk(ordenId, { transaction: t });
            if (!orden) {
                throw new Error('Orden no encontrada');
            }
            await orden.update({
                proveedor_id,
                fecha,
                estado,
            }, { transaction: t });

            // Eliminar los detalles existentes
            await DetalleOrden.destroy({ where: { orden_id: ordenId }, transaction: t });

            // Insertar los nuevos detalles
            for (const detalle of detalles) {
                await DetalleOrden.create({
                    orden_id: ordenId,
                    articulo_id: detalle.articulo_id,
                    cantidad: detalle.cantidad,
                }, { transaction: t });
            }

            return orden;
        });

        const respuesta = ResponseFactory.createSuccessResponse(result, 'Orden y detalles actualizados exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al actualizar la orden y los detalles');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Eliminar una orden
exports.eliminarOrden = async (req, res) => {
    const { ordenId } = req.params;
    try {
        const result = await sequelize.transaction(async (t) => {
            const orden = await OrdenCompra.findByPk(ordenId, { transaction: t });
            if (!orden) {
                throw new Error('Orden no encontrada');
            }
            await DetalleOrden.destroy({ where: { orden_id: ordenId }, transaction: t });
            await orden.destroy({ transaction: t });
            return orden;
        });

        const respuesta = ResponseFactory.createSuccessResponse(null, 'Orden eliminada exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al eliminar la orden');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Obtener detalles de una orden con el precio total
exports.obtenerDetalleOrdenConPrecio = async (req, res) => {
    const { ordenId } = req.params;

    try {
        const detalles = await DetalleOrden.findAll({
            where: { orden_id: ordenId },
            include: {
                model: Articulo,
                attributes: ['nombre', 'precio'],
            },
        });

        if (detalles.length > 0) {
            const respuesta = ResponseFactory.createSuccessResponse(detalles, 'Detalles de la orden obtenidos exitosamente');
            res.status(respuesta.status).json(respuesta.body);
        } else {
            const respuesta = ResponseFactory.createNotFoundResponse('No se encontraron detalles para la orden');
            res.status(respuesta.status).json(respuesta.body);
        }
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener el detalle de la orden');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Confirmar la recepción de una orden de compra
exports.confirmarRecepcionOrden = async (req, res) => {
    const { ordenId } = req.params;

    const transaction = await sequelize.transaction();

    try {
        const orden = await OrdenCompra.findByPk(ordenId, {
            include: [{ model: DetalleOrden, include: [Articulo] }],
            transaction
        });

        if (!orden) {
            const respuesta = ResponseFactory.createNotFoundResponse('Orden de compra no encontrada');
            return res.status(respuesta.status).json(respuesta.body);
        }

        // Actualizar el estado de la orden a "Recibida"
        await orden.update({ estado: 'Recibida' }, { transaction });

        // Actualizar el inventario de materias primas
        for (let detalle of orden.DetalleOrdens) {
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
        const respuesta = ResponseFactory.createSuccessResponse(orden, 'Orden de compra recibida y stock actualizado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        await transaction.rollback();
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al confirmar la recepción de la orden de compra');
        res.status(respuesta.status).json(respuesta.body);
    }
};