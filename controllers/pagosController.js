const pool = require('../db');
const ResponseFactory = require('../helpers/ResponseFactory');

// Crear un nuevo pago y actualizar el estado del pedido a "Completado"
exports.crearPago = async (req, res) => {
    const { pedido_id, fecha_pago, metodo_pago } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Iniciar transacción

        // Obtener el precio total del pedido
        const pedidoResult = await client.query('SELECT precio_total FROM pedidos WHERE pedido_id = $1', [pedido_id]);
        if (pedidoResult.rows.length === 0) {
            throw new Error('Pedido no encontrado');
        }
        const monto = pedidoResult.rows[0].precio_total;

        // Insertar el pago
        const insertPagoSQL = `
            INSERT INTO pagos (pedido_id, fecha_pago, monto, metodo_pago)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const pagoResult = await client.query(insertPagoSQL, [pedido_id, fecha_pago, monto, metodo_pago]);
        const pago = pagoResult.rows[0];

        // Actualizar el estado del pedido a "Completado"
        const updatePedidoSQL = `
            UPDATE pedidos
            SET estado_pago = 'Completado'
            WHERE pedido_id = $1
            RETURNING *;
        `;
        const pedidoUpdateResult = await client.query(updatePedidoSQL, [pedido_id]);

        await client.query('COMMIT'); // Finalizar transacción

        const respuesta = ResponseFactory.createSuccessResponse({ pago, pedido: pedidoUpdateResult.rows[0] }, 'Pago creado y pedido actualizado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        await client.query('ROLLBACK'); // Revertir transacción en caso de error
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al crear el pago y actualizar el pedido');
        res.status(respuesta.status).json(respuesta.body);
    } finally {
        client.release();
    }
};

// Obtener todos los pagos
exports.obtenerPagos = async (req, res) => {
    try {
        const pagosSQL = 'SELECT * FROM pagos';
        const pagosResult = await pool.query(pagosSQL);
        const pagos = pagosResult.rows;

        const respuesta = ResponseFactory.createSuccessResponse(pagos, 'Pagos obtenidos exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener los pagos');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Actualizar un pago existente
exports.actualizarPago = async (req, res) => {
    const { pagoId } = req.params;
    const { pedido_id, fecha_pago, metodo_pago } = req.body;

    try {
        const consultaSQL = `
            UPDATE pagos
            SET pedido_id = COALESCE($1, pedido_id),
                fecha_pago = COALESCE($2, fecha_pago),
                metodo_pago = COALESCE($3, metodo_pago)
            WHERE pago_id = $4
            RETURNING *;
        `;
        const resultado = await pool.query(consultaSQL, [pedido_id, fecha_pago, metodo_pago, pagoId]);

        if (resultado.rows.length > 0) {
            const respuesta = ResponseFactory.createSuccessResponse(resultado.rows[0], 'Pago actualizado exitosamente');
            res.status(respuesta.status).json(respuesta.body);
        } else {
            const respuesta = ResponseFactory.createNotFoundResponse('Pago no encontrado');
            res.status(respuesta.status).json(respuesta.body);
        }
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al actualizar el pago');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Eliminar un pago
exports.eliminarPago = async (req, res) => {
    const { pagoId } = req.params;
    try {
        const resultado = await pool.query('DELETE FROM pagos WHERE pago_id = $1 RETURNING *', [pagoId]);

        if (resultado.rowCount > 0) {
            const respuesta = ResponseFactory.createSuccessResponse(null, 'Pago eliminado exitosamente');
            res.status(respuesta.status).json(respuesta.body);
        } else {
            const respuesta = ResponseFactory.createNotFoundResponse('Pago no encontrado');
            res.status(respuesta.status).json(respuesta.body);
        }
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al eliminar el pago');
        res.status(respuesta.status).json(respuesta.body);
    }
};
