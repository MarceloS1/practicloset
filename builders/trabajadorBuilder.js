class TrabajadorBuilder {
    constructor() {
        this.trabajador = {};
    }

    setNombre(nombre) {
        this.trabajador.nombre = nombre;
        return this;
    }

    setApellido(apellido) {
        this.trabajador.apellido = apellido;
        return this;
    }

    setCedula(cedula) {
        this.trabajador.cedula = cedula;
        return this;
    }

    setEmail(email) {
        this.trabajador.email = email;
        return this;
    }

    setTelefono(telefono) {
        this.trabajador.telefono = telefono;
        return this;
    }

    setCargo(cargo) {
        this.trabajador.cargo = cargo;
        return this;
    }

    setFechaIngreso(fecha_ingreso) {
        this.trabajador.fecha_ingreso = fecha_ingreso;
        return this;
    }

    setSalario(salario) {
        this.trabajador.salario = salario;
        return this;
    }

    build() {
        return this.trabajador;
    }
}

module.exports = TrabajadorBuilder;
