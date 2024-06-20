const Categoria = require('../models/Categoria');
const ResponseFactory = require('../helpers/responseFactory');
const CategoriaService = require('../facades/categoriasService');

// Obtener todas las categorías
exports.obtenerCategorias = async (req, res, next) => {
    try {
        const categorias = await CategoriaService.obtenerCategorias();
        const respuesta = ResponseFactory.createSuccessResponse(categorias, 'Categorías obtenidas exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        console.error('Error al obtener categorías:', error.message);
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener categorías');
        res.status(respuesta.status).json(respuesta.body);
    }
};