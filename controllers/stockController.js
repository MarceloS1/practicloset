const pool = require('../db');
const ResponseFactory = require('../helpers/ResponseFactory');

// Actualizar stock
exports.actualizarStock = async (req, res, next) => {
    const { producto_id } = req.params;
    const { cantidad_disponible, cantidad_reservada } = req.body;

    try {
        const consultaSQL = `
            UPDATE stock
            SET cantidad_disponible = $1, cantidad_reservada = $2
            WHERE producto_id = $3
            RETURNING *;
        `;
        const resultado = await pool.query(consultaSQL, [cantidad_disponible, cantidad_reservada, producto_id]);

        if (resultado.rows.length > 0) {
            const respuesta = ResponseFactory.createSuccessResponse(resultado.rows[0], 'Stock actualizado exitosamente');
            res.status(respuesta.status).json(respuesta.body);
        } else {
            const respuesta = ResponseFactory.createNotFoundResponse('Stock no encontrado');
            res.status(respuesta.status).json(respuesta.body);
        }
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al actualizar stock');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Eliminar stock
exports.eliminarStock = async (req, res, next) => {
    const { producto_id } = req.params;

    try {
        const consultaSQL = `
            DELETE FROM stock
            WHERE producto_id = $1
            RETURNING *;
        `;
        const resultado = await pool.query(consultaSQL, [producto_id]);

        if (resultado.rowCount > 0) {
            const respuesta = ResponseFactory.createSuccessResponse(null, 'Stock eliminado exitosamente');
            res.status(respuesta.status).json(respuesta.body);
        } else {
            const respuesta = ResponseFactory.createNotFoundResponse('Stock no encontrado');
            res.status(respuesta.status).json(respuesta.body);
        }
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al eliminar stock');
        res.status(respuesta.status).json(respuesta.body);
    }
};
