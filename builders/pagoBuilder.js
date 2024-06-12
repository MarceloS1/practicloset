class PagoBuilder {
    constructor() {
        this.pago = {};
    }

    setPedidoId(pedido_id) {
        this.pago.pedido_id = pedido_id;
        return this;
    }

    setFechaPago(fecha_pago) {
        this.pago.fecha_pago = fecha_pago;
        return this;
    }

    setMonto(monto) {
        this.pago.monto = monto;
        return this;
    }

    setMetodoPago(metodo_pago) {
        this.pago.metodo_pago = metodo_pago;
        return this;
    }

    build() {
        return this.pago;
    }
}

module.exports = PagoBuilder;
