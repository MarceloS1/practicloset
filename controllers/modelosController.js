const Modelo = require('../models/Modelo');
const ResponseFactory = require('../helpers/ResponseFactory');

// Agregar un nuevo modelo
exports.agregarModelo = async (req, res, next) => {
    const { nombre, tipo, descripcion, material, alto, ancho, precio, imagen_url } = req.body;
    try {
        const modelo = await Modelo.create({
            nombre,
            tipo,
            descripcion,
            material,
            alto,
            ancho,
            precio,
            imagen_url,
        });
        const respuesta = ResponseFactory.createSuccessResponse(modelo, 'Modelo agregado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al agregar modelo');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Obtener todos los modelos
exports.obtenerModelos = async (req, res, next) => {
    try {
        const modelos = await Modelo.findAll();
        const respuesta = ResponseFactory.createSuccessResponse(modelos, 'Modelos obtenidos exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener modelos');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Actualizar un modelo específico
exports.actualizarModelo = async (req, res, next) => {
    const { modelo_id } = req.params;
    const { nombre, tipo, descripcion, material, alto, ancho, precio, imagen_url } = req.body;
    try {
        const modelo = await Modelo.findByPk(modelo_id);
        if (!modelo) {
            const respuesta = ResponseFactory.createNotFoundResponse('Modelo no encontrado');
            return res.status(respuesta.status).json(respuesta.body);
        }
        await modelo.update({
            nombre,
            tipo,
            descripcion,
            material,
            alto,
            ancho,
            precio,
            imagen_url,
        });
        const respuesta = ResponseFactory.createSuccessResponse(modelo, 'Modelo actualizado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al actualizar modelo');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Eliminar un modelo específico
exports.eliminarModelo = async (req, res, next) => {
    const { modelo_id } = req.params;
    try {
        const modelo = await Modelo.findByPk(modelo_id);
        if (!modelo) {
            const respuesta = ResponseFactory.createNotFoundResponse('Modelo no encontrado');
            return res.status(respuesta.status).json(respuesta.body);
        }
        await modelo.destroy();
        const respuesta = ResponseFactory.createSuccessResponse(null, 'Modelo eliminado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al eliminar modelo');
        res.status(respuesta.status).json(respuesta.body);
    }
};
