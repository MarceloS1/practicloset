const pool = require('../db');
const ResponseFactory = require('../helpers/ResponseFactory');

// Obtener todos los proveedores
exports.obtenerProveedores = async (req, res, next) => {
    try {
        const resultado = await pool.query('SELECT * FROM proveedores');
        const respuesta = ResponseFactory.createSuccessResponse(resultado.rows, 'Proveedores obtenidos exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener proveedores');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Crear un nuevo proveedor
exports.crearProveedor = async (req, res, next) => {
    const { nombre, direccion, telefono, email, comentario, tiempo_entrega_estimado } = req.body;

    try {
        const consultaSQL = `
            INSERT INTO proveedores (nombre, direccion, telefono, email, comentario, tiempo_entrega_estimado)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const valores = [nombre, direccion, telefono, email, comentario, tiempo_entrega_estimado];
        const resultado = await pool.query(consultaSQL, valores);
        const respuesta = ResponseFactory.createSuccessResponse(resultado.rows[0], 'Proveedor creado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al crear proveedor');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Actualizar un proveedor existente
exports.actualizarProveedor = async (req, res, next) => {
    const { proveedor_id } = req.params;
    const { nombre, direccion, telefono, email, comentario, tiempo_entrega_estimado } = req.body;

    try {
        const consultaSQL = `
            UPDATE proveedores
            SET nombre = COALESCE($1, nombre),
                direccion = COALESCE($2, direccion),
                telefono = COALESCE($3, telefono),
                email = COALESCE($4, email),
                comentario = COALESCE($5, comentario),
                tiempo_entrega_estimado = COALESCE($6, tiempo_entrega_estimado)
            WHERE proveedor_id = $7
            RETURNING *;
        `;
        const valores = [nombre, direccion, telefono, email, comentario, tiempo_entrega_estimado, proveedor_id];
        const resultado = await pool.query(consultaSQL, valores);

        if (resultado.rows.length > 0) {
            const respuesta = ResponseFactory.createSuccessResponse(resultado.rows[0], 'Proveedor actualizado exitosamente');
            res.status(respuesta.status).json(respuesta.body);
        } else {
            const respuesta = ResponseFactory.createNotFoundResponse('Proveedor no encontrado');
            res.status(respuesta.status).json(respuesta.body);
        }
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al actualizar proveedor');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Eliminar un proveedor
exports.eliminarProveedor = async (req, res, next) => {
    const { proveedor_id } = req.params;

    try {
        const resultado = await pool.query('DELETE FROM proveedores WHERE proveedor_id = $1 RETURNING *', [proveedor_id]);

        if (resultado.rowCount > 0) {
            const respuesta = ResponseFactory.createSuccessResponse(null, 'Proveedor eliminado exitosamente');
            res.status(respuesta.status).json(respuesta.body);
        } else {
            const respuesta = ResponseFactory.createNotFoundResponse('Proveedor no encontrado');
            res.status(respuesta.status).json(respuesta.body);
        }
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al eliminar proveedor');
        res.status(respuesta.status).json(respuesta.body);
    }
};
