const OrdenService = require('../facades/ordenService');
const ResponseFactory = require('../helpers/responseFactory');

// Crear una nueva orden de compra
exports.crearOrden = async (req, res) => {
    try {
        const orden = await OrdenService.crearOrden(req.body);
        const respuesta = ResponseFactory.createSuccessResponse(orden, 'Orden de compra y detalles creados exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al crear la orden de compra y los detalles');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Obtener todas las órdenes
exports.obtenerOrdenes = async (req, res) => {
    try {
        const ordenes = await OrdenService.obtenerOrdenes();
        const respuesta = ResponseFactory.createSuccessResponse(ordenes, 'Órdenes obtenidas exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener las órdenes');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Actualizar una orden existente
exports.actualizarOrden = async (req, res) => {
    const { ordenId } = req.params;

    try {
        const orden = await OrdenService.actualizarOrden(ordenId, req.body);
        const respuesta = ResponseFactory.createSuccessResponse(orden, 'Orden y detalles actualizados exitosamente');
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
        await OrdenService.eliminarOrden(ordenId);
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
        const detalles = await OrdenService.obtenerDetalleOrdenConPrecio(ordenId);

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

    try {
        const orden = await OrdenService.confirmarRecepcionOrden(ordenId);
        const respuesta = ResponseFactory.createSuccessResponse(orden, 'Orden de compra recibida y stock actualizado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al confirmar la recepción de la orden de compra');
        res.status(respuesta.status).json(respuesta.body);
    }
};

