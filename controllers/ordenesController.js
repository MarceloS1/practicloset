const pool = require('../db');
const ResponseFactory = require('../helpers/ResponseFactory');

// Crear una nueva orden de compra
exports.crearOrden = async (req, res) => {
        const client = await pool.connect();
        const { proveedor_id, fecha, estado, detalles } = req.body;
    
        try {
            // Iniciar transacción
            await client.query('BEGIN');
    
            // Crear la orden
            const consultaOrdenSQL = `
                INSERT INTO ordenes_compra (proveedor_id, fecha, estado)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            const valoresOrden = [proveedor_id, fecha, estado];
            const resultadoOrden = await client.query(consultaOrdenSQL, valoresOrden);
            const orden = resultadoOrden.rows[0];
    
            // Crear los detalles de la orden
            const consultaDetalleSQL = `
                INSERT INTO detalles_orden (orden_id, articulo_id, cantidad)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
    
            for (const detalle of detalles) {
                const valoresDetalle = [orden.orden_id, detalle.articulo_id, detalle.cantidad];
                await client.query(consultaDetalleSQL, valoresDetalle);
            }
    
            // Commit de la transacción
            await client.query('COMMIT');
    
            const respuesta = ResponseFactory.createSuccessResponse(orden, 'Orden de compra y detalles creados exitosamente');
            res.status(respuesta.status).json(respuesta.body);
    
        } catch (error) {
            // Rollback de la transacción en caso de error
            await client.query('ROLLBACK');
            const respuesta = ResponseFactory.createErrorResponse(error, 'Error al crear la orden de compra y los detalles');
            res.status(respuesta.status).json(respuesta.body);
        } finally {
            client.release();
        }
    };


// Obtener todas las órdenes
exports.obtenerOrdenes = async (req, res, next) => {
    try {
        const consultaOrdenesSQL = `
            SELECT o.*, d.articulo_id, d.cantidad, a.nombre AS nombre_articulo, a.precio AS precio_articulo
            FROM ordenes_compra o
            LEFT JOIN detalles_orden d ON o.orden_id = d.orden_id
            LEFT JOIN articulos a ON d.articulo_id = a.articulo_id
        `;
        const resultado = await pool.query(consultaOrdenesSQL);
        
        // Agrupar detalles por orden
        const ordenes = resultado.rows.reduce((acumulador, fila) => {
            const { orden_id, proveedor_id, fecha, estado, articulo_id, cantidad, nombre_articulo, precio_articulo } = fila;
            const ordenExistente = acumulador.find(orden => orden.orden_id === orden_id);
            const detalle = { articulo_id, cantidad, nombre_articulo, precio_articulo };

            if (ordenExistente) {
                ordenExistente.detalles.push(detalle);
            } else {
                acumulador.push({
                    orden_id,
                    proveedor_id,
                    fecha,
                    estado,
                    detalles: [detalle]
                });
            }

            return acumulador;
        }, []);

        const respuesta = ResponseFactory.createSuccessResponse(ordenes, 'Órdenes obtenidas exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener las órdenes');
        res.status(respuesta.status).json(respuesta.body);
    }
};


// Actualizar una orden existente
exports.actualizarOrden = async (req, res, next) => {
    const client = await pool.connect();
    const { ordenId } = req.params;
    const { proveedor_id, fecha, estado, detalles } = req.body;

    try {
        // Iniciar transacción
        await client.query('BEGIN');

        // Actualizar la orden
        const consultaOrdenSQL = `
            UPDATE ordenes_compra
            SET proveedor_id = COALESCE($1, proveedor_id), 
                fecha = COALESCE($2, fecha), 
                estado = COALESCE($3, estado)
            WHERE orden_id = $4
            RETURNING *;
        `;
        const valoresOrden = [proveedor_id, fecha, estado, ordenId];
        const resultadoOrden = await client.query(consultaOrdenSQL, valoresOrden);
        const orden = resultadoOrden.rows[0];

        if (!orden) {
            await client.query('ROLLBACK');
            const respuesta = ResponseFactory.createNotFoundResponse('Orden no encontrada');
            return res.status(respuesta.status).json(respuesta.body);
        }

        // Actualizar los detalles de la orden
        const consultaEliminarDetallesSQL = `DELETE FROM detalles_orden WHERE orden_id = $1`;
        await client.query(consultaEliminarDetallesSQL, [ordenId]);

        const consultaDetalleSQL = `
            INSERT INTO detalles_orden (orden_id, articulo_id, cantidad)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;

        for (const detalle of detalles) {
            const valoresDetalle = [orden.orden_id, detalle.articulo_id, detalle.cantidad];
            await client.query(consultaDetalleSQL, valoresDetalle);
        }

        // Commit de la transacción
        await client.query('COMMIT');

        const respuesta = ResponseFactory.createSuccessResponse(orden, 'Orden y detalles actualizados exitosamente');
        res.status(respuesta.status).json(respuesta.body);

    } catch (error) {
        // Rollback de la transacción en caso de error
        await client.query('ROLLBACK');
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al actualizar la orden y los detalles');
        res.status(respuesta.status).json(respuesta.body);
    } finally {
        client.release();
    }
};

// Eliminar una orden
exports.eliminarOrden = async (req, res) => {
    const { ordenId } = req.params;
    try {
        const resultado = await pool.query('DELETE FROM ordenes_compra WHERE orden_id = $1', [ordenId]);
        if (resultado.rowCount > 0) {
            const respuesta = ResponseFactory.createSuccessResponse(null, 'Orden eliminada exitosamente');
            res.status(respuesta.status).json(respuesta.body);
        } else {
            const respuesta = ResponseFactory.createNotFoundResponse('Orden no encontrada');
            res.status(respuesta.status).json(respuesta.body);
        }
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al eliminar la orden');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Obtener detalles de una orden con el precio total
exports.obtenerDetalleOrdenConPrecio = async (req, res) => {
    const { ordenId } = req.params;

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
            WHERE oc.orden_id = $1;
        `;

        const { rows } = await pool.query(consultaSQL, [ordenId]);
        if (rows.length > 0) {
            const respuesta = ResponseFactory.createSuccessResponse(rows, 'Detalles de la orden obtenidos exitosamente');
            res.status(respuesta.status).json(respuesta.body);
        } else {
            const respuesta = ResponseFactory.createNotFoundResponse('No se encontraron detalles para la orden');
            res.status(respuesta.status).json(respuesta.body);
        }
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener el detalle de la orden');
        res.status(respuesta.status).json(respuesta.body);
    }
};
