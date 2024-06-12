class TransaccionInventarioBuilder {
    constructor() {
        this.transaccion = {};
    }

    setModeloId(modelo_id) {
        this.transaccion.modelo_id = modelo_id;
        return this;
    }

    setTipoTransaccion(tipo_transaccion) {
        this.transaccion.tipo_transaccion = tipo_transaccion;
        return this;
    }

    setCantidad(cantidad) {
        this.transaccion.cantidad = cantidad;
        return this;
    }

    setNota(nota) {
        this.transaccion.nota = nota;
        return this;
    }

    build() {
        return this.transaccion;
    }
}

module.exports = TransaccionInventarioBuilder;
