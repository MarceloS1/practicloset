const pool = require('../db');
const ResponseFactory = require('../helpers/ResponseFactory');

// Agregar un nuevo modelo
exports.agregarModelo = async (req, res, next) => {
    const { nombre, tipo, descripcion, material, alto, ancho, precio, imagen_url } = req.body;
    try {
        const consultaSQL = `
            INSERT INTO modelos (nombre, tipo, descripcion, material, alto, ancho, precio, imagen_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const resultado = await pool.query(consultaSQL, [nombre, tipo, descripcion, material, alto, ancho, precio, imagen_url]);
        const respuesta = ResponseFactory.createSuccessResponse(resultado.rows[0], 'Modelo agregado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al agregar modelo');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Obtener todos los modelos
exports.obtenerModelos = async (req, res, next) => {
    try {
        const consultaSQL = 'SELECT * FROM modelos';
        const resultado = await pool.query(consultaSQL);
        const respuesta = ResponseFactory.createSuccessResponse(resultado.rows, 'Modelos obtenidos exitosamente');
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
        const consultaSQL = `
            UPDATE modelos SET nombre = $1, tipo = $2, descripcion = $3, material = $4, alto = $5, ancho = $6, precio = $7, imagen_url = $8
            WHERE modelo_id = $9
            RETURNING *;
        `;
        const resultado = await pool.query(consultaSQL, [nombre, tipo, descripcion, material, alto, ancho, precio, imagen_url, modelo_id]);
        if (resultado.rows.length > 0) {
            const respuesta = ResponseFactory.createSuccessResponse(resultado.rows[0], 'Modelo actualizado exitosamente');
            res.status(respuesta.status).json(respuesta.body);
        } else {
            const respuesta = ResponseFactory.createNotFoundResponse('Modelo no encontrado');
            res.status(respuesta.status).json(respuesta.body);
        }
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al actualizar modelo');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Eliminar un modelo específico
exports.eliminarModelo = async (req, res, next) => {
    const { modelo_id } = req.params;
    try {
        const consultaSQL = `DELETE FROM modelos WHERE modelo_id = $1 RETURNING *;`;
        const resultado = await pool.query(consultaSQL, [modelo_id]);
        if (resultado.rowCount > 0) {
            const respuesta = ResponseFactory.createSuccessResponse(null, 'Modelo eliminado exitosamente');
            res.status(respuesta.status).json(respuesta.body);
        } else {
            const respuesta = ResponseFactory.createNotFoundResponse('Modelo no encontrado');
            res.status(respuesta.status).json(respuesta.body);
        }
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al eliminar modelo');
        res.status(respuesta.status).json(respuesta.body);
    }
};
