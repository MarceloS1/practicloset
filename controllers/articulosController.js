// articulosController.js
const pool = require('../db');
const ResponseFactory = require('../helpers/ResponseFactory');

// Obtener todos los artículos
exports.obtenerArticulos = async (req, res, next) => {
    try {
        const consultaSQL = 'SELECT * FROM articulos';
        const resultado = await pool.query(consultaSQL);
        const respuesta = ResponseFactory.createSuccessResponse(resultado.rows);
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        next(error);
    }
};

// Crear un nuevo artículo
exports.crearArticulo = async (req, res, next) => {
    const { nombre, precio, tipo, proveedor_id } = req.body;
    try {
        const consultaSQL = 'INSERT INTO articulos (nombre, precio, tipo, proveedor_id) VALUES ($1, $2, $3, $4) RETURNING *;';
        const resultado = await pool.query(consultaSQL, [nombre, precio, tipo, proveedor_id]);
        const respuesta = ResponseFactory.createSuccessResponse(resultado.rows[0]);
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
        const consultaSQL = 'UPDATE articulos SET nombre = $1, precio = $2, tipo = $3, proveedor_id = $4 WHERE articulo_id = $5 RETURNING *;';
        const resultado = await pool.query(consultaSQL, [nombre, precio, tipo, proveedor_id, articulo_id]);
        if (resultado.rows.length > 0) {
            const respuesta = ResponseFactory.createSuccessResponse(resultado.rows[0]);
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
        const consultaSQL = 'DELETE FROM articulos WHERE articulo_id = $1 RETURNING *;';
        const resultado = await pool.query(consultaSQL, [articulo_id]);
        if (resultado.rowCount > 0) {
          const respuesta = ResponseFactory.createSuccessResponse(resultado.rows[0]);
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
        const consultaSQL = `
            SELECT articulos.articulo_id, articulos.nombre, articulos.precio, articulos.tipo, proveedores.nombre AS nombre_proveedor
            FROM articulos
            JOIN proveedores ON articulos.proveedor_id = proveedores.proveedor_id;
        `;
        const resultado = await pool.query(consultaSQL);
        const respuesta = ResponseFactory.createSuccessResponse(resultado.rows);
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        next(error);
    }
};
