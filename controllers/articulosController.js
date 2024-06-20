const { Articulo, Proveedor, Stock } = require('../models')
const ResponseFactory = require('../helpers/responseFactory');
const ArticuloService = require('../facades/articuloService');

exports.obtenerArticulos = async (req, res, next) => {
    try {
        const articulos = await ArticuloService.obtenerArticulos();
        const respuesta = ResponseFactory.createSuccessResponse(articulos);
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        next(error);
    }
};

exports.crearArticulo = async (req, res, next) => {
    try {
        const articulo = await ArticuloService.crearArticulo(req.body);
        const respuesta = ResponseFactory.createSuccessResponse(articulo);
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        next(error);
    }
};

exports.actualizarArticulo = async (req, res, next) => {
    try {
        const articulo = await ArticuloService.actualizarArticulo(req.params.articulo_id, req.body);
        if (!articulo) {
            const respuesta = ResponseFactory.createNotFoundResponse('Artículo no encontrado');
            return res.status(respuesta.status).json(respuesta.body);
        }
        const respuesta = ResponseFactory.createSuccessResponse(articulo);
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        next(error);
    }
};

exports.eliminarArticulo = async (req, res, next) => {
    try {
        const articulo = await ArticuloService.eliminarArticulo(req.params.articulo_id);
        if (!articulo) {
            const respuesta = ResponseFactory.createNotFoundResponse('Artículo no encontrado');
            return res.status(respuesta.status).json(respuesta.body);
        }
        const respuesta = ResponseFactory.createSuccessResponse(articulo);
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        next(error);
    }
};

exports.obtenerArticulosConProveedores = async (req, res, next) => {
    try {
        const articulos = await ArticuloService.obtenerArticulosConProveedores();
        const respuesta = ResponseFactory.createSuccessResponse(articulos);
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        next(error);
    }
};

exports.obtenerArticulosConStock = async (req, res) => {
    try {
        const articulos = await ArticuloService.obtenerArticulosConStock();
        const respuesta = ResponseFactory.createSuccessResponse(articulos, 'Artículos y stock obtenidos exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener artículos y stock');
        res.status(respuesta.status).json(respuesta.body);
    }
};