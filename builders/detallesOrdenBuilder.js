class DetalleOrdenBuilder {
    constructor() {
        this.detalle = {
            orden_id: null,
            articulo_id: null,
            cantidad: null
        };
    }

    setOrdenId(orden_id) {
        this.detalle.orden_id = orden_id;
        return this;
    }

    setArticuloId(articulo_id) {
        this.detalle.articulo_id = articulo_id;
        return this;
    }

    setCantidad(cantidad) {
        this.detalle.cantidad = cantidad;
        return this;
    }

    build() {
        return this.detalle;
    }
}

module.exports = DetalleOrdenBuilder;