class ProveedorBuilder {
    constructor() {
        this.proveedor = {};
    }

    setNombre(nombre) {
        this.proveedor.nombre = nombre;
        return this;
    }

    setDireccion(direccion) {
        this.proveedor.direccion = direccion;
        return this;
    }

    setTelefono(telefono) {
        this.proveedor.telefono = telefono;
        return this;
    }

    setEmail(email) {
        this.proveedor.email = email;
        return this;
    }

    setComentario(comentario) {
        this.proveedor.comentario = comentario;
        return this;
    }

    setTiempoEntregaEstimado(tiempo_entrega_estimado) {
        this.proveedor.tiempo_entrega_estimado = tiempo_entrega_estimado;
        return this;
    }

    build() {
        return this.proveedor;
    }
}

module.exports = ProveedorBuilder;
