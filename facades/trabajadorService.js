const Trabajador = require('../models/Trabajador');
const TrabajadorBuilder = require('../builders/trabajadorBuilder');

class TrabajadorService {
    async agregarTrabajador(data) {
        const { nombre, apellido, cedula, email, telefono, cargo, fecha_ingreso, salario } = data;

        const trabajadorBuilder = new TrabajadorBuilder()
            .setNombre(nombre)
            .setApellido(apellido)
            .setCedula(cedula)
            .setEmail(email)
            .setTelefono(telefono)
            .setCargo(cargo)
            .setFechaIngreso(fecha_ingreso)
            .setSalario(salario);

        return await Trabajador.create(trabajadorBuilder.build());
    }

    async actualizarTrabajador(trabajadorId, data) {
        const { nombre, apellido, cedula, email, telefono, cargo, fecha_ingreso, salario } = data;

        const trabajador = await Trabajador.findByPk(trabajadorId);
        if (!trabajador) {
            throw new Error('Trabajador no encontrado');
        }

        const trabajadorBuilder = new TrabajadorBuilder()
            .setNombre(nombre)
            .setApellido(apellido)
            .setCedula(cedula)
            .setEmail(email)
            .setTelefono(telefono)
            .setCargo(cargo)
            .setFechaIngreso(fecha_ingreso)
            .setSalario(salario);

        await trabajador.update(trabajadorBuilder.build());
        return trabajador;
    }

    async obtenerTrabajadores(trabajadorId) {
        if (trabajadorId) {
            const trabajador = await Trabajador.findByPk(trabajadorId);
            if (!trabajador) {
                throw new Error('Trabajador no encontrado');
            }
            return trabajador;
        } else {
            return await Trabajador.findAll();
        }
    }

    async eliminarTrabajador(trabajadorId) {
        const trabajador = await Trabajador.findByPk(trabajadorId);
        if (!trabajador) {
            throw new Error('Trabajador no encontrado');
        }

        await trabajador.destroy();
    }
}

module.exports = new TrabajadorService();
