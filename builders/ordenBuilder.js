class OrdenBuilder {
    constructor() {
        this.orden = {
            proveedor_id: null,
            fecha: null,
            estado: null,
            detalles: []
        };
    }

    setProveedorId(proveedor_id) {
        this.orden.proveedor_id = proveedor_id;
        return this;
    }

    setFecha(fecha) {
        this.orden.fecha = fecha;
        return this;
    }

    setEstado(estado) {
        this.orden.estado = estado;
        return this;
    }

    addDetalle(detalle) {
        this.orden.detalles.push(detalle);
        return this;
    }

    build() {
        return this.orden;
    }
}

module.exports = OrdenBuilder;