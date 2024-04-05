const { Pool } = require('pg');
const pool = new Pool({
  user: 'Marcelo',
  host: '25.56.40.70',
  database: 'practicloset_db',
  password: 'Passw0rd',
  port: 5433,
});

// Crear una nueva orden de compra
exports.crearOrden = async (req, res) => {
    const campos = req.body;
    const camposDefinidos = Object.keys(campos).filter(key => campos[key] !== undefined);

    const columnas = camposDefinidos.join(", ");
    const valores = camposDefinidos.map(key => campos[key]);
    const placeholders = camposDefinidos.map((_, index) => `$${index + 1}`).join(", ");

    const consultaSQL = `INSERT INTO ordenes_compra (${columnas}) VALUES (${placeholders}) RETURNING *`;

    try {
        const { rows } = await pool.query(consultaSQL, valores);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error al crear la orden:', error);
        res.status(500).send('Error al crear la orden de compra');
    }
};

// Obtener todas las órdenes
exports.obtenerOrdenes = async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM ordenes_compra');
        res.status(200).json(resultado.rows);
    } catch (error) {
        console.error('Error al obtener las órdenes:', error);
        res.status(500).send('Error al obtener las órdenes');
    }
};

// Obtener una orden específica por ID
exports.obtenerOrdenPorId = async (req, res) => {
    const { ordenId } = req.params;
    try {
        const resultado = await pool.query('SELECT * FROM ordenes_compra WHERE orden_id = $1', [ordenId]);
        if (resultado.rows.length > 0) {
            res.status(200).json(resultado.rows[0]);
        } else {
            res.status(404).send('Orden no encontrada');
        }
    } catch (error) {
        console.error('Error al obtener la orden:', error);
        res.status(500).send('Error al obtener la orden');
    }
};

// Actualizar una orden existente
exports.actualizarOrden = async (req, res) => {
    const { ordenId } = req.params;
    const campos = req.body;
    const camposDefinidos = Object.keys(campos).filter(key => campos[key] !== undefined);

    const columnas = camposDefinidos.map((campo, index) => `${campo} = $${index + 1}`);
    const valores = camposDefinidos.map(key => campos[key]);

    if (camposDefinidos.length === 0) {
        return res.status(400).send('No hay datos para actualizar.');
    }

    const consultaSQL = `UPDATE ordenes_compra SET ${columnas.join(', ')} WHERE orden_id = $${camposDefinidos.length + 1} RETURNING *`;

    try {
        const { rows } = await pool.query(consultaSQL, [...valores, ordenId]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).send('Orden no encontrada');
        }
    } catch (error) {
        console.error('Error al actualizar la orden:', error);
        res.status(500).send('Error al actualizar la orden');
    }
};

// Eliminar una orden
exports.eliminarOrden = async (req, res) => {
    const { ordenId } = req.params;
    try {
        const resultado = await pool.query('DELETE FROM ordenes_compra WHERE orden_id = $1', [ordenId]);
        if (resultado.rowCount > 0) {
            res.status(204).send(); // No Content
        } else {
            res.status(404).send('Orden no encontrada');
        }
    } catch (error) {
        console.error('Error al eliminar la orden:', error);
        res.status(500).send('Error al eliminar la orden');
    }
};

exports.agregarDetalleAOrden = async (req, res) => {
    const { ordenId } = req.params;
    const { articulo_id, cantidad } = req.body; // Continuamos asumiendo estos campos.

    try {
        // Verificación de la orden y el artículo como antes.
        const orden = await pool.query('SELECT proveedor_id FROM ordenes_compra WHERE orden_id = $1', [ordenId]);
        if (orden.rows.length === 0) {
            return res.status(404).send('Orden no encontrada');
        }

        const articulo = await pool.query('SELECT proveedor_id FROM articulos WHERE articulo_id = $1', [articulo_id]);
        if (articulo.rows.length === 0) {
            return res.status(404).send('Artículo no encontrado');
        }

        if (orden.rows[0].proveedor_id !== articulo.rows[0].proveedor_id) {
            return res.status(400).send('El artículo no pertenece al proveedor de la orden');
        }

        // Dinamizar la inserción de detalles de la orden.
        const campos = { articulo_id, cantidad }; // Extendible a más campos.
        const camposDefinidos = Object.keys(campos).filter(key => campos[key] !== undefined);

        // Asegurarse de incluir orden_id en la inserción.
        const columnas = ['orden_id', ...camposDefinidos].join(", ");
        const valores = [ordenId, ...camposDefinidos.map(key => campos[key])];
        const placeholders = valores.map((_, index) => `$${index + 1}`).join(", ");

        const consultaSQL = `INSERT INTO detalles_orden (${columnas}) VALUES (${placeholders}) RETURNING *`;

        const { rows } = await pool.query(consultaSQL, valores);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error al agregar detalle a la orden:', error);
        res.status(500).send('Error al agregar detalle a la orden');
    }
};


exports.actualizarDetalleOrden = async (req, res) => {
    const { detalleId } = req.params; // ID del detalle de la orden a actualizar
    const campos = req.body;
    const camposDefinidos = Object.keys(campos).filter(key => campos[key] !== undefined);

    const columnas = camposDefinidos.map((campo, index) => `${campo} = $${index + 2}`);
    const valores = camposDefinidos.map(key => campos[key]);

    if (camposDefinidos.length === 0) {
        return res.status(400).send('No hay datos para actualizar.');
    }

    const consultaSQL = `UPDATE detalles_orden SET ${columnas.join(', ')} WHERE detalle_id = $1 RETURNING *`;

    try {
        const { rows } = await pool.query(consultaSQL, [detalleId, ...valores]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).send('Detalle de orden no encontrado');
        }
    } catch (error) {
        console.error('Error al actualizar detalle de orden:', error);
        res.status(500).send('Error al actualizar detalle de orden');
    }
};

exports.eliminarDetalleOrden = async (req, res) => {
    const { detalleId } = req.params; // ID del detalle de la orden a eliminar
    try {
        const resultado = await pool.query('DELETE FROM detalles_orden WHERE detalle_id = $1', [detalleId]);
        if (resultado.rowCount > 0) {
            res.status(204).send(); // No Content, éxito en la eliminación
        } else {
            res.status(404).send('Detalle de orden no encontrado');
        }
    } catch (error) {
        console.error('Error al eliminar detalle de orden:', error);
        res.status(500).send('Error al eliminar detalle de orden');
    }
};

exports.obtenerDetalleOrdenConPrecio = async (req, res) => {
        const { ordenId } = req.params; // Asegúrate de usar req.params para acceder al ordenId
    
        try {
            const consultaSQL = `
                SELECT 
                    oc.orden_id, 
                    oc.fecha, 
                    p.nombre AS nombre_proveedor, 
                    a.nombre AS nombre_articulo, 
                    detalles.cantidad, 
                    a.precio AS precio_unidad, 
                    (a.precio * detalles.cantidad) AS total_precio
                FROM ordenes_compra oc
                LEFT JOIN proveedores p ON oc.proveedor_id = p.proveedor_id
                LEFT JOIN detalles_orden detalles ON oc.orden_id = detalles.orden_id
                LEFT JOIN articulos a ON detalles.articulo_id = a.articulo_id
                WHERE oc.orden_id = $1;  -- Asegurándose de filtrar por orden_id
            `;
    
            const { rows } = await pool.query(consultaSQL, [ordenId]);
            if (rows.length > 0) {
                res.status(200).json(rows);
            } else {
                res.status(404).send('No se encontraron detalles para la orden');
            }
        } catch (error) {
            console.error('Error al obtener el detalle de la orden:', error);
            res.status(500).send('Error interno del servidor');
        };
    }
