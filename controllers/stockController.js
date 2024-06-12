const Stock = require('../models/Stock');
const Op = require('../sequelize');
const ResponseFactory = require('../helpers/responseFactory');

// Actualizar stock
exports.actualizarStock = async (req, res) => {
    const { modelo_id, articulo_id } = req.params;
    const { cantidad_disponible, cantidad_reservada } = req.body;

    try {
        let stock;
        if (modelo_id) {
            stock = await Stock.findOne({ where: { modelo_id } });
        } else if (articulo_id) {
            stock = await Stock.findOne({ where: { articulo_id } });
        }

        if (!stock) {
            const respuesta = ResponseFactory.createNotFoundResponse('Stock no encontrado');
            return res.status(respuesta.status).json(respuesta.body);
        }

        await stock.update({ cantidad_disponible, cantidad_reservada });

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
        const stock = await Stock.findOne({ where: { producto_id } });

        if (!stock) {
            const respuesta = ResponseFactory.createNotFoundResponse('Stock no encontrado');
            return res.status(respuesta.status).json(respuesta.body);
        }

        await stock.destroy();
        const respuesta = ResponseFactory.createSuccessResponse(null, 'Stock eliminado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al eliminar stock');
        res.status(respuesta.status).json(respuesta.body);
    }
};
