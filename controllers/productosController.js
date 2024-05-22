const pool = require('../db');
const ResponseFactory = require('../helpers/ResponseFactory');

// Obtener todos los productos con stock
exports.obtenerProductos = async (req, res, next) => {
    try {
        const consultaSQL = `
            SELECT productos.producto_id, productos.nombre, productos.descripcion, productos.categoria_id, stock.cantidad_disponible, stock.cantidad_reservada
            FROM productos
            LEFT JOIN stock ON productos.producto_id = stock.producto_id;
        `;
        const resultado = await pool.query(consultaSQL);
        const respuesta = ResponseFactory.createSuccessResponse(resultado.rows, 'Productos obtenidos exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener productos con stock');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Actualizar un producto existente
exports.actualizarProducto = async (req, res, next) => {
    const { producto_id } = req.params;
    const { nombre, descripcion, categoria_id } = req.body;

    try {
        const consultaSQL = `
            UPDATE productos 
            SET nombre = $1, descripcion = $2, categoria_id = $3 
            WHERE producto_id = $4 
            RETURNING *;
        `;
        const resultado = await pool.query(consultaSQL, [nombre, descripcion, categoria_id, producto_id]);

        if (resultado.rows.length > 0) {
            const respuesta = ResponseFactory.createSuccessResponse(resultado.rows[0], 'Producto actualizado exitosamente');
            res.status(respuesta.status).json(respuesta.body);
        } else {
            const respuesta = ResponseFactory.createNotFoundResponse('Producto no encontrado');
            res.status(respuesta.status).json(respuesta.body);
        }
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al actualizar producto');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Eliminar un producto
exports.eliminarProducto = async (req, res, next) => {
    const { producto_id } = req.params;

    try {
        const consultaSQL = `DELETE FROM productos WHERE producto_id = $1 RETURNING *;`;
        const resultado = await pool.query(consultaSQL, [producto_id]);

        if (resultado.rowCount > 0) {
            const respuesta = ResponseFactory.createSuccessResponse(null, 'Producto eliminado exitosamente');
            res.status(respuesta.status).json(respuesta.body);
        } else {
            const respuesta = ResponseFactory.createNotFoundResponse('Producto no encontrado');
            res.status(respuesta.status).json(respuesta.body);
        }
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al eliminar producto');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Agregar un nuevo producto y su stock
exports.agregarProductoYStock = async (req, res, next) => {
    const { nombre, descripcion, categoria_id, cantidad_disponible, cantidad_reservada } = req.body;
    const client = await pool.connect();

    try {
        // Iniciar transacción
        await client.query('BEGIN');

        // Insertar producto
        const insertProductoQuery = `
            INSERT INTO productos (nombre, descripcion, categoria_id)
            VALUES ($1, $2, $3) RETURNING producto_id;
        `;
        const productoResult = await client.query(insertProductoQuery, [nombre, descripcion, categoria_id]);
        const producto_id = productoResult.rows[0].producto_id;

        // Insertar stock usando el producto_id obtenido
        const insertStockQuery = `
            INSERT INTO stock (producto_id, cantidad_disponible, cantidad_reservada)
            VALUES ($1, $2, $3);
        `;
        await client.query(insertStockQuery, [producto_id, cantidad_disponible, cantidad_reservada]);

        // Commit de la transacción
        await client.query('COMMIT');

        const respuesta = ResponseFactory.createSuccessResponse({ producto_id }, 'Producto y stock agregados exitosamente');
        res.status(respuesta.status).json(respuesta.body);

    } catch (error) {
        // Rollback de la transacción en caso de error
        await client.query('ROLLBACK');
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al agregar producto y stock');
        res.status(respuesta.status).json(respuesta.body);
    } finally {
        client.release();
    }
};
