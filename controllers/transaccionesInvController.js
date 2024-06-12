const ResponseFactory = require('../helpers/responseFactory');
const InventoryFacade = require('../facades/InventoryFacade');

exports.agregarTransaccionYActualizarStock = async (req, res) => {
    const { modelo_id, tipo_transaccion, cantidad, nota } = req.body;

    try {
        const result = await InventoryFacade.addTransactionAndUpdateStock({ modelo_id, tipo_transaccion, cantidad, nota });
        const respuesta = ResponseFactory.createSuccessResponse(result, 'Transacción y actualización de stock realizadas con éxito');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al agregar transacción y actualizar stock');
        res.status(respuesta.status).json(respuesta.body);
    }
};