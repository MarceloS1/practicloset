const PagoService = require('../facades/pagoService');
const ResponseFactory = require('../helpers/responseFactory');

// Crear un nuevo pago y actualizar el estado del pedido a "Completado"
exports.crearPago = async (req, res) => {
    try {
        const result = await PagoService.crearPago(req.body);
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
        const pagos = await PagoService.obtenerPagos();
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
    try {
        const pago = await PagoService.actualizarPago(pagoId, req.body);
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
        await PagoService.eliminarPago(pagoId);
        const respuesta = ResponseFactory.createSuccessResponse(null, 'Pago eliminado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al eliminar el pago');
        res.status(respuesta.status).json(respuesta.body);
    }
};
