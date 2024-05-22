const pool = require('../db');
const ResponseFactory = require('../helpers/ResponseFactory');

exports.obtenerCategorias = async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM categorias ORDER BY nombre');
        const respuesta = ResponseFactory.createSuccessResponse(resultado.rows, 'Categorías obtenidas exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        console.error('Error al obtener categorías:', error.message);
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener categorías');
        res.status(respuesta.status).json(respuesta.body);
    }
};

