const ModeloService = require('../facades/modeloService');
const ResponseFactory = require('../helpers/responseFactory');

// Obtener todos los modelos con stock
exports.obtenerModelos = async (req, res) => {
    try {
        const modelos = await ModeloService.obtenerModelos();
        const respuesta = ResponseFactory.createSuccessResponse(modelos, 'Modelos obtenidos exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener modelos con stock');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Actualizar un modelo existente
exports.actualizarModelo = async (req, res) => {
    const { modelo_id } = req.params;
    const data = req.body;

    try {
        const modelo = await ModeloService.actualizarModelo(modelo_id, data);
        const respuesta = ResponseFactory.createSuccessResponse(modelo, 'Modelo y stock actualizados exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al actualizar modelo y stock');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Eliminar un modelo
exports.eliminarModelo = async (req, res) => {
    const { modelo_id } = req.params;

    try {
        await ModeloService.eliminarModelo(modelo_id);
        const respuesta = ResponseFactory.createSuccessResponse(null, 'Modelo eliminado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al eliminar modelo');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Agregar un nuevo modelo y su stock
exports.agregarModelo = async (req, res) => {
    const data = req.body;

    try {
        const modelo = await ModeloService.agregarModelo(data);
        const respuesta = ResponseFactory.createSuccessResponse(modelo, 'Modelo y stock agregados exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al agregar modelo y stock');
        res.status(respuesta.status).json(respuesta.body);
    }
};
