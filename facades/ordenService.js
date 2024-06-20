const { DetalleOrden, Articulo, Stock } = require('../models');
const OrdenCompra = require('../models/OrdenCompra');
const sequelize = require('../sequelize');
const OrdenBuilder = require('../builders/ordenBuilder');
const DetalleOrdenBuilder = require('../builders/detallesOrdenBuilder');
const ValidacionStockHandler = require('../handlers/validacionStockHandler');
const CalculoPrecioHandler = require('../handlers/calculoPrecioHandler');

class OrdenService {
    async crearOrden(data) {
        const { proveedor_id, fecha, estado, detalles } = data;
        const transaction = await sequelize.transaction();

        try {
            // Configurar la cadena de responsabilidad
            const validacionStockHandler = new ValidacionStockHandler();
            const calculoPrecioHandler = new CalculoPrecioHandler();

            validacionStockHandler.setNext(calculoPrecioHandler);

            // Crear la solicitud
            const request = { detalles };

            // Procesar la solicitud a través de la cadena
            await validacionStockHandler.handle(request);

            const ordenBuilder = new OrdenBuilder()
                .setProveedorId(proveedor_id)
                .setFecha(fecha)
                .setEstado(estado);

            detalles.forEach(detalle => {
                const detalleBuilder = new DetalleOrdenBuilder()
                    .setArticuloId(detalle.articulo_id)
                    .setCantidad(detalle.cantidad)
                    .build();

                ordenBuilder.addDetalle(detalleBuilder);
            });

            const ordenData = ordenBuilder.build();

            // Crear la orden
            const orden = await OrdenCompra.create({
                proveedor_id: ordenData.proveedor_id,
                fecha: ordenData.fecha,
                estado: ordenData.estado,
                precio_total: request.precioTotal
            }, { transaction });

            // Crear los detalles de la orden
            const detallesOrden = ordenData.detalles.map(detalle => ({
                orden_id: orden.orden_id,
                articulo_id: detalle.articulo_id,
                cantidad: detalle.cantidad
            }));

            await DetalleOrden.bulkCreate(detallesOrden, { transaction });

            await transaction.commit();

            return orden;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async obtenerOrdenes() {
        return await OrdenCompra.findAll({
            include: [{
                model: DetalleOrden,
                include: [Articulo]
            }]
        });
    }

    async actualizarOrden(ordenId, data) {
        const { proveedor_id, fecha, estado, detalles } = data;

        try {
            return await sequelize.transaction(async (t) => {
                // Actualizar la orden
                const orden = await OrdenCompra.findByPk(ordenId, { transaction: t });
                if (!orden) {
                    throw new Error('Orden no encontrada');
                }
                await orden.update({
                    proveedor_id,
                    fecha,
                    estado,
                }, { transaction: t });

                // Eliminar los detalles existentes
                await DetalleOrden.destroy({ where: { orden_id: ordenId }, transaction: t });

                // Insertar los nuevos detalles
                for (const detalle of detalles) {
                    const detalleBuilder = new DetalleOrdenBuilder()
                        .setOrdenId(ordenId)
                        .setArticuloId(detalle.articulo_id)
                        .setCantidad(detalle.cantidad)
                        .build();

                    await DetalleOrden.create(detalleBuilder, { transaction: t });
                }

                return orden;
            });
        } catch (error) {
            throw error;
        }
    }

    async eliminarOrden(ordenId) {
        try {
            return await sequelize.transaction(async (t) => {
                const orden = await OrdenCompra.findByPk(ordenId, { transaction: t });
                if (!orden) {
                    throw new Error('Orden no encontrada');
                }
                await DetalleOrden.destroy({ where: { orden_id: ordenId }, transaction: t });
                await orden.destroy({ transaction: t });
                return orden;
            });
        } catch (error) {
            throw error;
        }
    }

    async obtenerDetalleOrdenConPrecio(ordenId) {
        try {
            const detalles = await DetalleOrden.findAll({
                where: { orden_id: ordenId },
                include: {
                    model: Articulo,
                    attributes: ['nombre', 'precio'],
                },
            });

            return detalles;
        } catch (error) {
            throw error;
        }
    }

    async confirmarRecepcionOrden(ordenId) {
        const transaction = await sequelize.transaction();

        try {
            const orden = await OrdenCompra.findByPk(ordenId, {
                include: [{ model: DetalleOrden, include: [Articulo] }],
                transaction
            });

            if (!orden) {
                throw new Error('Orden de compra no encontrada');
            }

            // Actualizar el estado de la orden a "Recibida"
            await orden.update({ estado: 'Recibida' }, { transaction });

            // Actualizar el inventario de materias primas
            for (let detalle of orden.DetalleOrdens) {
                const stock = await Stock.findOne({ where: { articulo_id: detalle.articulo_id }, transaction });
                if (stock) {
                    stock.cantidad_disponible += detalle.cantidad;
                    await stock.save({ transaction });
                } else {
                    await Stock.create({
                        articulo_id: detalle.articulo_id,
                        cantidad_disponible: detalle.cantidad,
                        cantidad_reservada: 0
                    }, { transaction });
                }
            }

            await transaction.commit();
            return orden;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = new OrdenService();
