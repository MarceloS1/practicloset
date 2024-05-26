const Articulo = require('../models/articulo');
const Proveedor = require('../models/Proveedor');
const ResponseFactory = require('../helpers/ResponseFactory');

// Obtener todos los artículos
exports.obtenerArticulos = async (req, res, next) => {
    try {
        const articulos = await Articulo.findAll();
        const respuesta = ResponseFactory.createSuccessResponse(articulos);
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        next(error);
    }
};

// Crear un nuevo artículo
exports.crearArticulo = async (req, res, next) => {
    const { nombre, precio, tipo, proveedor_id } = req.body;
    try {
        const articulo = await Articulo.create({ nombre, precio, tipo, proveedor_id });
        const respuesta = ResponseFactory.createSuccessResponse(articulo);
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        next(error);
    }
};

// Actualizar un artículo existente
exports.actualizarArticulo = async (req, res, next) => {
    const { articulo_id } = req.params;
    const { nombre, precio, tipo, proveedor_id } = req.body;
    try {
        const articulo = await Articulo.findByPk(articulo_id);
        if (articulo) {
            await articulo.update({ nombre, precio, tipo, proveedor_id });
            const respuesta = ResponseFactory.createSuccessResponse(articulo);
            res.status(respuesta.status).json(respuesta.body);
        } else {
            const respuesta = ResponseFactory.createNotFoundResponse('Artículo no encontrado');
            res.status(respuesta.status).json(respuesta.body);
        }
    } catch (error) {
        next(error);
    }
};

// Eliminar un artículo
exports.eliminarArticulo = async (req, res, next) => {
    const { articulo_id } = req.params;
    try {
        const articulo = await Articulo.findByPk(articulo_id);
        if (articulo) {
            await articulo.destroy();
            const respuesta = ResponseFactory.createSuccessResponse(articulo);
            res.status(respuesta.status).json(respuesta.body);
        } else {
            const respuesta = ResponseFactory.createNotFoundResponse('Artículo no encontrado');
            res.status(respuesta.status).json(respuesta.body);
        }
    } catch (error) {
        next(error);
    }
};

// Obtener artículos con información del proveedor
exports.obtenerArticulosConProveedores = async (req, res, next) => {
    try {
        const articulos = await Articulo.findAll({
            include: {
                model: Proveedor,
                attributes: ['nombre'],
            },
        });
        const respuesta = ResponseFactory.createSuccessResponse(articulos);
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        next(error);
    }
};
