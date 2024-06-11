const { Pedido, DetallePedido, Modelo, Stock} = require('../models');
const sequelize = require('../sequelize');
const ResponseFactory = require('../helpers/ResponseFactory');
const { Subject } = require('../observers/observer');
const StockObserver = require('../observers/StockObserver');
const EntregaObserver = require('../observers/EntregaObserver');

const orderSubject = new Subject();
const stockObserver = new StockObserver();
const entregaObserver = new EntregaObserver();

orderSubject.subscribe(stockObserver);
orderSubject.subscribe(entregaObserver);

exports.crearPedido = async (req, res) => {
    const { cliente_id, fecha_entrega, estado_pago, modelos } = req.body;
    const transaction = await sequelize.transaction();

    try {
        // Verificar el stock disponible antes de crear el pedido
        for (let modelo of modelos) {
            const modeloData = await Modelo.findByPk(modelo.modelo_id, { transaction });
            if (!modeloData) {
                throw new Error('Modelo no encontrado: ' + modelo.modelo_id);
            }

            const stock = await Stock.findOne({ where: { modelo_id: modelo.modelo_id }, transaction });
            if (stock) {
                if (stock.cantidad_disponible < modelo.cantidad) {
                    throw new Error('Stock insuficiente para el modelo: ' + modelo.modelo_id);
                }
            } else {
                throw new Error('Stock no encontrado para el modelo: ' + modelo.modelo_id);
            }
        }

        // Calcular el precio total del pedido
        let precioTotal = 0;
        for (let modelo of modelos) {
            const modeloData = await Modelo.findByPk(modelo.modelo_id, { transaction });
            precioTotal += modeloData.precio * modelo.cantidad;
        }

        // Insertar el pedido
        const pedido = await Pedido.create({
            cliente_id,
            fecha_entrega,
            estado_pago,
            precio_total: precioTotal,
            estado_entrega: 'pendiente' // Agregar estado_entrega
        }, { transaction });

        // Insertar detalles del pedido
        for (let modelo of modelos) {
            await DetallePedido.create({
                pedido_id: pedido.pedido_id,
                modelo_id: modelo.modelo_id,
                cantidad: modelo.cantidad
            }, { transaction });
        }

        // Notificar al observador para actualizar el stock
        await orderSubject.notify({ modelos });

        await transaction.commit();

        const respuesta = ResponseFactory.createSuccessResponse(pedido, 'Pedido creado y stock actualizado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        await transaction.rollback();
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al crear el pedido y actualizar el stock');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Obtener todos los pedidos
exports.obtenerPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            include: [{
                model: DetallePedido,
                include: [Modelo]
            }]
        });

        const respuesta = ResponseFactory.createSuccessResponse(pedidos, 'Pedidos obtenidos exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener los pedidos');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Actualizar un pedido existente
exports.actualizarPedido = async (req, res) => {
    const { pedidoId } = req.params;
    const { cliente_id, fecha_entrega, estado_pago, estado_entrega, modelos } = req.body;
    const transaction = await sequelize.transaction();

    try {
        // Calcular el nuevo precio total del pedido
        let precioTotal = 0;
        for (let modelo of modelos) {
            const modeloData = await Modelo.findByPk(modelo.modelo_id);
            if (modeloData) {
                precioTotal += modeloData.precio * modelo.cantidad;
            } else {
                throw new Error('Modelo no encontrado');
            }
        }

        const pedido = await Pedido.findByPk(pedidoId, { include: [DetallePedido], transaction });
        if (pedido) {
            const estadoAnterior = pedido.estado_entrega;

            await pedido.update({
                cliente_id,
                fecha_entrega,
                estado_pago,
                estado_entrega,
                precio_total: precioTotal
            }, { transaction });

            // Eliminar los detalles del pedido existentes
            await DetallePedido.destroy({ where: { pedido_id: pedidoId }, transaction });

            // Insertar los nuevos detalles del pedido
            for (let modelo of modelos) {
                await DetallePedido.create({
                    pedido_id: pedidoId,
                    modelo_id: modelo.modelo_id,
                    cantidad: modelo.cantidad
                }, { transaction });
            }

            // Notificar al observador para actualizar el stock si el estado de entrega ha cambiado
            if (estadoAnterior === 'pendiente' && estado_entrega === 'entregado') {
                await deliveryObserver.update(pedido);
            }

            await transaction.commit();

            const respuesta = ResponseFactory.createSuccessResponse(pedido, 'Pedido actualizado exitosamente');
            res.status(respuesta.status).json(respuesta.body);
        } else {
            await transaction.rollback();
            const respuesta = ResponseFactory.createNotFoundResponse('Pedido no encontrado');
            res.status(respuesta.status).json(respuesta.body);
        }
    } catch (error) {
        await transaction.rollback();
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al actualizar el pedido');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Eliminar un pedido
exports.eliminarPedido = async (req, res) => {
    const { pedidoId } = req.params;
    try {
        const pedido = await Pedido.findByPk(pedidoId);
        if (pedido) {
            await pedido.destroy();
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

exports.completarEntrega = async (req, res) => {
    const { pedidoId } = req.params;
    const { estado_entrega } = req.body;
    const transaction = await sequelize.transaction();

    try {
        const pedido = await Pedido.findByPk(pedidoId, { include: [DetallePedido], transaction });

        if (!pedido) {
            await transaction.rollback();
            const respuesta = ResponseFactory.createNotFoundResponse('Pedido no encontrado');
            return res.status(respuesta.status).json(respuesta.body);
        }

        const estadoAnterior = pedido.estado_entrega;

        console.log('Estado anterior:', estadoAnterior);
        console.log('Estado nuevo:', estado_entrega);

        await pedido.update({ estado_entrega }, { transaction });

        console.log('Pedido actualizado:', pedido);

        if (estadoAnterior === 'pendiente' && estado_entrega === 'entregado') {
            console.log('Notificando al observador de entrega');
            await entregaObserver.update(pedido);
        }

        await transaction.commit();

        const respuesta = ResponseFactory.createSuccessResponse(pedido, 'Estado del pedido actualizado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        await transaction.rollback();
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al actualizar el estado del pedido');
        res.status(respuesta.status).json(respuesta.body);
    }
};