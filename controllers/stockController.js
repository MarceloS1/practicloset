const StockService = require('../facades/stockService');
const ResponseFactory = require('../helpers/responseFactory');

// Actualizar stock
exports.actualizarStock = async (req, res) => {
    try {
        const stock = await StockService.actualizarStock(req.params, req.body);
        const respuesta = ResponseFactory.createSuccessResponse(stock, 'Stock actualizado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al actualizar stock');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Eliminar stock
exports.eliminarStock = async (req, res) => {
    const { producto_id } = req.params;

    try {
        await StockService.eliminarStock(producto_id);
        const respuesta = ResponseFactory.createSuccessResponse(null, 'Stock eliminado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al eliminar stock');
        res.status(respuesta.status).json(respuesta.body);
    }
};
