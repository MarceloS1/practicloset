const { Pedido, DetallePedido, Modelo, Stock} = require('../models');
const sequelize = require('../sequelize');
const ResponseFactory = require('../helpers/ResponseFactory');
const { Subject } = require('../observers/observer');
const StockObserver = require('../observers/StockObserver');

const orderSubject = new Subject();
const stockObserver = new StockObserver();

orderSubject.subscribe(stockObserver);

exports.crearPedido = async (req, res) => {
    const { cliente_id, fecha_entrega, estado_pago, modelos } = req.body;
    const transaction = await sequelize.transaction();
    const stockObserver = new StockObserver();

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
            precio_total: precioTotal
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
        await stockObserver.update({ modelos }, transaction);

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
    const { cliente_id, fecha_entrega, estado_pago, modelos } = req.body;
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

        const pedido = await Pedido.findByPk(pedidoId);
        if (pedido) {
            await pedido.update({
                cliente_id,
                fecha_entrega,
                estado_pago,
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
