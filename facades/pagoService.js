const { Pago, Pedido } = require('../models');
const PagoBuilder = require('../builders/pagoBuilder');
const sequelize = require('../sequelize');

class PagoService {
    async crearPago(data) {
        const { pedido_id, fecha_pago, metodo_pago } = data;

        return await sequelize.transaction(async (t) => {
            // Obtener el precio total del pedido
            const pedido = await Pedido.findByPk(pedido_id, { transaction: t });
            if (!pedido) {
                throw new Error('Pedido no encontrado');
            }
            const monto = pedido.precio_total;

            // Construir el pago usando PagoBuilder
            const pagoBuilder = new PagoBuilder()
                .setPedidoId(pedido_id)
                .setFechaPago(fecha_pago)
                .setMonto(monto)
                .setMetodoPago(metodo_pago);
            const pago = await Pago.create(pagoBuilder.build(), { transaction: t });

            // Actualizar el estado del pedido a "Completado"
            await pedido.update({ estado_pago: 'Completado' }, { transaction: t });

            return { pago, pedido };
        });
    }

    async obtenerPagos() {
        return await Pago.findAll();
    }

    async actualizarPago(pagoId, data) {
        const { pedido_id, fecha_pago, metodo_pago } = data;

        const pago = await Pago.findByPk(pagoId);
        if (!pago) {
            throw new Error('Pago no encontrado');
        }

        // Construir el pago actualizado usando PagoBuilder
        const pagoBuilder = new PagoBuilder()
            .setPedidoId(pedido_id)
            .setFechaPago(fecha_pago)
            .setMetodoPago(metodo_pago);
        await pago.update(pagoBuilder.build());

        return pago;
    }

    async eliminarPago(pagoId) {
        const pago = await Pago.findByPk(pagoId);
        if (!pago) {
            throw new Error('Pago no encontrado');
        }
        await pago.destroy();
        return pago;
    }
}

module.exports = new PagoService();
