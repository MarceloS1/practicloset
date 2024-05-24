const pool = require('../db');
const ResponseFactory = require('../helpers/ResponseFactory');

// Crear un nuevo pedido
exports.crearPedido = async (req, res) => {
    const { cliente_id, fecha_entrega, estado_pago, modelos } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Iniciar transacción

        // Calcular el precio total del pedido
        let precioTotal = 0;
        for (let modelo of modelos) {
            const modeloResult = await client.query('SELECT precio FROM modelos WHERE modelo_id = $1', [modelo.modelo_id]);
            if (modeloResult.rows.length > 0) {
                precioTotal += modeloResult.rows[0].precio * modelo.cantidad;
            } else {
                throw new Error('Modelo no encontrado');
            }
        }

        // Insertar el pedido
        const insertPedidoSQL = `
            INSERT INTO pedidos (cliente_id, fecha_entrega, estado_pago, precio_total)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const pedidoResult = await client.query(insertPedidoSQL, [cliente_id, fecha_entrega, estado_pago, precioTotal]);
        const pedido = pedidoResult.rows[0];

        // Insertar detalles del pedido
        const insertDetalleSQL = `
            INSERT INTO detalles_pedido (pedido_id, modelo_id, cantidad)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        for (let modelo of modelos) {
            await client.query(insertDetalleSQL, [pedido.pedido_id, modelo.modelo_id, modelo.cantidad]);
        }

        await client.query('COMMIT'); // Finalizar transacción

        const respuesta = ResponseFactory.createSuccessResponse(pedido, 'Pedido creado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        await client.query('ROLLBACK'); // Revertir transacción en caso de error
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al crear el pedido');
        res.status(respuesta.status).json(respuesta.body);
    } finally {
        client.release();
    }
};

// Obtener todos los pedidos
exports.obtenerPedidos = async (req, res) => {
    try {
        // Obtener todos los pedidos
        const pedidosSQL = 'SELECT * FROM pedidos';
        const pedidosResult = await pool.query(pedidosSQL);
        const pedidos = pedidosResult.rows;

        // Obtener detalles de cada pedido
        const pedidosConDetalles = await Promise.all(pedidos.map(async (pedido) => {
            const detallesSQL = `
                SELECT dp.*, m.nombre AS nombre_modelo
                FROM detalles_pedido dp
                JOIN modelos m ON dp.modelo_id = m.modelo_id
                WHERE dp.pedido_id = $1;
            `;
            const detallesResult = await pool.query(detallesSQL, [pedido.pedido_id]);
            const detalles = detallesResult.rows;

            return {
                ...pedido,
                detalles
            };
        }));

        const respuesta = ResponseFactory.createSuccessResponse(pedidosConDetalles, 'Pedidos obtenidos exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener los pedidos');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Actualizar un pedido existente
exports.actualizarPedido = async (req, res) => {
    const { pedidoId } = req.params;
    const { cliente_id, fecha_entrega, estado_pago, modelos } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Iniciar transacción

        // Calcular el nuevo precio total del pedido
        let precioTotal = 0;
        for (let modelo of modelos) {
            const modeloResult = await client.query('SELECT precio FROM modelos WHERE modelo_id = $1', [modelo.modelo_id]);
            if (modeloResult.rows.length > 0) {
                precioTotal += modeloResult.rows[0].precio * modelo.cantidad;
            } else {
                throw new Error('Modelo no encontrado');
            }
        }

        // Actualizar el pedido
        const consultaSQL = `
            UPDATE pedidos
            SET cliente_id = COALESCE($1, cliente_id),
                fecha_entrega = COALESCE($2, fecha_entrega),
                estado_pago = COALESCE($3, estado_pago),
                precio_total = $4
            WHERE pedido_id = $5
            RETURNING *;
        `;
        const resultado = await pool.query(consultaSQL, [cliente_id, fecha_entrega, estado_pago, precioTotal, pedidoId]);

        if (resultado.rows.length > 0) {
            const pedido = resultado.rows[0];

            // Eliminar los detalles del pedido existentes
            await client.query('DELETE FROM detalles_pedido WHERE pedido_id = $1', [pedidoId]);

            // Insertar los nuevos detalles del pedido
            const insertDetalleSQL = `
                INSERT INTO detalles_pedido (pedido_id, modelo_id, cantidad)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            for (let modelo of modelos) {
                await client.query(insertDetalleSQL, [pedidoId, modelo.modelo_id, modelo.cantidad]);
            }

            await client.query('COMMIT'); // Finalizar transacción

            const respuesta = ResponseFactory.createSuccessResponse(pedido, 'Pedido actualizado exitosamente');
            res.status(respuesta.status).json(respuesta.body);
        } else {
            await client.query('ROLLBACK');
            const respuesta = ResponseFactory.createNotFoundResponse('Pedido no encontrado');
            res.status(respuesta.status).json(respuesta.body);
        }
    } catch (error) {
        await client.query('ROLLBACK'); // Revertir transacción en caso de error
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al actualizar el pedido');
        res.status(respuesta.status).json(respuesta.body);
    } finally {
        client.release();
    }
};

// Eliminar un pedido
exports.eliminarPedido = async (req, res) => {
    const { pedidoId } = req.params;
    try {
        const resultado = await pool.query('DELETE FROM pedidos WHERE pedido_id = $1 RETURNING *', [pedidoId]);

        if (resultado.rowCount > 0) {
            const respuesta = ResponseFactory.createSuccessResponse(null, 'Pedido eliminado exitosamente');
            res.status(respuesta.status).json(respuesta.body);
        } else {
            const respuesta = ResponseFactory.createNotFoundResponse('Pedido no encontrado');
            res.status(respuesta.status).json(respuesta.body);
        }
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al eliminar el pedido');
        res.status(respuesta.status).json(respuesta.body);
    }
};
