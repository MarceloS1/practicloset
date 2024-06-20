const { Pedido, DetallePedido, Modelo, Stock } = require('../models');
const sequelize = require('../sequelize');
const { Subject } = require('../observers/observer');
const StockObserver = require('../observers/StockObserver');
const EntregaObserver = require('../observers/EntregaObserver');
const ResponseFactory = require('../helpers/responseFactory');

const orderSubject = new Subject();
const stockObserver = new StockObserver();
const entregaObserver = new EntregaObserver();

orderSubject.subscribe(stockObserver);

class PedidoService {
    async crearPedido(data) {
        const { cliente_id, fecha_entrega, estado_pago, modelos } = data;
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
                estado_entrega: 'pendiente'
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
            await orderSubject.notify({ modelos }, transaction);

            await transaction.commit();
            return pedido;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async obtenerPedidos() {
        return await Pedido.findAll({
            include: [{
                model: DetallePedido,
                include: [Modelo]
            }]
        });
    }

    async actualizarPedido(pedidoId, data) {
        const { cliente_id, fecha_entrega, estado_pago, estado_entrega, modelos } = data;
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
                    await entregaObserver.update(pedido);
                }

                await transaction.commit();
                return pedido;
            } else {
                await transaction.rollback();
                throw new Error('Pedido no encontrado');
            }
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async eliminarPedido(pedidoId) {
        const transaction = await sequelize.transaction();
        try {
            const pedido = await Pedido.findByPk(pedidoId, { transaction });
            if (pedido) {
                await pedido.destroy({ transaction });
                await transaction.commit();
                return pedido;
            } else {
                await transaction.rollback();
                throw new Error('Pedido no encontrado');
            }
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async completarEntrega(pedidoId, estado_entrega) {
        const transaction = await sequelize.transaction();

        try {
            const pedido = await Pedido.findByPk(pedidoId, { transaction });

            if (!pedido) {
                await transaction.rollback();
                throw new Error('Pedido no encontrado');
            }

            const estadoAnterior = pedido.estado_entrega;
            await pedido.update({ estado_entrega }, { transaction });

            if (estadoAnterior === 'pendiente' && estado_entrega === 'entregado') {
                await entregaObserver.update(pedido);
            }

            await transaction.commit();
            return pedido;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = new PedidoService();
