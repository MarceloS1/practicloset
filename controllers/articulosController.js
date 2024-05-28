const Articulo = require('../models/articulo');
const Proveedor = require('../models/Proveedor');
const ResponseFactory = require('../helpers/ResponseFactory');
const Stock = require('../models/Stock');

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

exports.obtenerArticulosConStock = async (req, res) => {
    try {
        const articulos = await Articulo.findAll({
            include: [{
                model: Stock,
                attributes: ['cantidad_disponible', 'cantidad_reservada'],
                required: false // Esto permite que se incluyan artículos sin stock registrado
            }]
        });

        // Establecer stock en 0 para los artículos que no tienen stock registrado
        const articulosConStock = articulos.map(articulo => {
            if (!articulo.Stock) {
                articulo.dataValues.Stock = {
                    cantidad_disponible: 0,
                    cantidad_reservada: 0
                };
            }
            return articulo;
        });

        const respuesta = ResponseFactory.createSuccessResponse(articulosConStock, 'Artículos y stock obtenidos exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener artículos y stock');
        res.status(respuesta.status).json(respuesta.body);
    }
};