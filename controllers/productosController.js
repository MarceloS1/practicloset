const { Pool } = require('pg');
const pool = new Pool({
  user: 'Marcelo',
  host: '25.56.40.70',
  database: 'practicloset_db',
  password: 'Passw0rd',
  port: 5433,
});

exports.obtenerProductos = async (req, res) => {
        try {
            const consultaSQL = `
                SELECT productos.producto_id, productos.nombre, productos.descripcion, productos.categoria_id, stock.cantidad_disponible, stock.cantidad_reservada
                FROM productos
                LEFT JOIN stock ON productos.producto_id = stock.producto_id;
            `;
            const resultado = await pool.query(consultaSQL);
            res.status(200).json(resultado.rows);
        } catch (error) {
            console.error('Error al obtener productos con stock:', error);
            res.status(500).send('Error al obtener productos con stock');
        }
};

exports.actualizarProducto = async (req, res) => {
    const { producto_id } = req.params;
    const { nombre, descripcion, categoria_id } = req.body;
    try {
        const consultaSQL = `UPDATE productos SET nombre = $1, descripcion = $2, categoria_id = $3 WHERE producto_id = $4 RETURNING *;`;
        const resultado = await pool.query(consultaSQL, [nombre, descripcion, categoria_id, producto_id]);
        if (resultado.rows.length > 0) {
            res.status(200).json(resultado.rows[0]);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error('Error al actualizar producto:', error.message);
        res.status(500).send('Error al actualizar producto');
    }
};

exports.eliminarProducto = async (req, res) => {
    const { producto_id } = req.params;
    try {
        const consultaSQL = `DELETE FROM productos WHERE producto_id = $1 RETURNING *;`;
        const resultado = await pool.query(consultaSQL, [producto_id]);
        if (resultado.rowCount > 0) {
            res.status(204).send(); // No Content
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error.message);
        res.status(500).send('Error al eliminar producto');
    }
};

exports.agregarProductoYStock = async (req, res) => {
        const { nombre, descripcion, categoria_id, cantidad_disponible, cantidad_reservada } = req.body;
    
        try {
            // Iniciar transacción
            await pool.query('BEGIN');
    
            // Insertar producto
            const insertProductoQuery = `
                INSERT INTO productos (nombre, descripcion, categoria_id)
                VALUES ($1, $2, $3) RETURNING producto_id;
            `;
            const productoResult = await pool.query(insertProductoQuery, [nombre, descripcion, categoria_id]);
            const producto_id = productoResult.rows[0].producto_id;
    
            // Insertar stock usando el producto_id obtenido
            const insertStockQuery = `
                INSERT INTO stock (producto_id, cantidad_disponible, cantidad_reservada)
                VALUES ($1, $2, $3);
            `;
            await pool.query(insertStockQuery, [producto_id, cantidad_disponible, cantidad_reservada]);
    
            // Commit de la transacción
            await pool.query('COMMIT');
    
            res.status(201).json({ mensaje: 'Producto y stock agregados exitosamente', producto_id: producto_id });
        } catch (error) {
            // En caso de error, revertir la transacción
            await pool.query('ROLLBACK');
            console.error('Error al agregar producto y stock:', error);
            res.status(500).send('Error al agregar producto y stock');
        }
    };
