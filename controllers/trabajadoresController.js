const TrabajadorService = require('../facades/trabajadorService');
const ResponseFactory = require('../helpers/responseFactory');

// Agregar un nuevo trabajador
exports.agregarTrabajador = async (req, res) => {
    try {
        const trabajador = await TrabajadorService.agregarTrabajador(req.body);
        const respuesta = ResponseFactory.createSuccessResponse(trabajador, 'Trabajador agregado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al agregar trabajador');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Actualizar un trabajador existente
exports.actualizarTrabajador = async (req, res) => {
    const { trabajadorId } = req.params;
    try {
        const trabajador = await TrabajadorService.actualizarTrabajador(trabajadorId, req.body);
        const respuesta = ResponseFactory.createSuccessResponse(trabajador, 'Trabajador actualizado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al actualizar el trabajador');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Obtener todos los trabajadores o un trabajador específico por ID
exports.obtenerTrabajadores = async (req, res) => {
    const { trabajadorId } = req.params;

    try {
        const trabajadores = await TrabajadorService.obtenerTrabajadores(trabajadorId);
        const respuesta = ResponseFactory.createSuccessResponse(trabajadores, 'Trabajador(es) obtenido(s) exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener trabajadores');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Eliminar un trabajador
exports.eliminarTrabajador = async (req, res) => {
    const { trabajadorId } = req.params;

    try {
        await TrabajadorService.eliminarTrabajador(trabajadorId);
        const respuesta = ResponseFactory.createSuccessResponse(null, 'Trabajador eliminado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al eliminar el trabajador');
        res.status(respuesta.status).json(respuesta.body);
    }
};
