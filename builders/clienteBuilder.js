class ClienteBuilder {
    constructor() {
        this.cliente = {};
    }

    setNombre(nombre) {
        this.cliente.nombre = nombre;
        return this;
    }

    setApellido(apellido) {
        this.cliente.apellido = apellido;
        return this;
    }

    setCedula(cedula) {
        this.cliente.cedula = cedula;
        return this;
    }

    setEmail(email) {
        this.cliente.email = email;
        return this;
    }

    setTelefono(telefono) {
        this.cliente.telefono = telefono;
        return this;
    }

    setDireccion(direccion) {
        this.cliente.direccion = direccion;
        return this;
    }

    build() {
        return this.cliente;
    }
}

module.exports = ClienteBuilder;
