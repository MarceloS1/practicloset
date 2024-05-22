const pool = require('../db');
const ResponseFactory = require('../helpers/ResponseFactory');

// Agregar transacción de inventario y actualizar stock
exports.agregarTransaccionYActualizarStock = async (req, res, next) => {
    const { producto_id, tipo_transaccion, cantidad, nota } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Iniciar transacción

        // Verificar stock actual si es una salida
        if (tipo_transaccion === 'salida') {
            const checkStockSQL = 'SELECT cantidad_disponible FROM stock WHERE producto_id = $1';
            const stockResult = await client.query(checkStockSQL, [producto_id]);
            const stockDisponible = stockResult.rows[0].cantidad_disponible;

            if (stockDisponible < cantidad) {
                await client.query('ROLLBACK');
                const respuesta = ResponseFactory.createErrorResponse(new Error('Stock insuficiente'), 'No hay suficiente stock disponible para esta transacción');
                return res.status(respuesta.status).json(respuesta.body);
            }
        }

        // Insertar transacción de inventario
        const insertTransaccionSQL = `
            INSERT INTO transacciones_inventario (producto_id, tipo_transaccion, cantidad, fecha_transaccion, nota)
            VALUES ($1, $2, $3, NOW(), $4)
            RETURNING *;
        `;
        const transaccionResult = await client.query(insertTransaccionSQL, [producto_id, tipo_transaccion, cantidad, nota]);
        const transaccion = transaccionResult.rows[0];

        // Actualizar stock
        let updateStockSQL;
        if (tipo_transaccion === 'entrada') {
            updateStockSQL = 'UPDATE stock SET cantidad_disponible = cantidad_disponible + $1 WHERE producto_id = $2 RETURNING *;';
        } else if (tipo_transaccion === 'salida') {
            updateStockSQL = 'UPDATE stock SET cantidad_disponible = cantidad_disponible - $1 WHERE producto_id = $2 RETURNING *;';
        }

        let stockResult;
        if (updateStockSQL) {
            stockResult = await client.query(updateStockSQL, [cantidad, producto_id]);
        }

        await client.query('COMMIT'); // Finalizar transacción

        const respuesta = ResponseFactory.createSuccessResponse({ transaccion, stock: stockResult.rows[0] }, 'Transacción y actualización de stock realizadas con éxito');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        await client.query('ROLLBACK'); // Revertir transacción en caso de error
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al agregar transacción y actualizar stock');
        res.status(respuesta.status).json(respuesta.body);
    } finally {
        client.release();
    }
};
