const { Cliente } = require('../models');
const ClienteBuilder = require('../builders/clienteBuilder');

class ClienteService {
    async agregarCliente(datosCliente) {
        const clienteBuilder = new ClienteBuilder()
            .setNombre(datosCliente.nombre)
            .setApellido(datosCliente.apellido)
            .setCedula(datosCliente.cedula)
            .setEmail(datosCliente.email)
            .setTelefono(datosCliente.telefono)
            .setDireccion(datosCliente.direccion);

        return await Cliente.create(clienteBuilder.build());
    }

    async obtenerClientes() {
        return await Cliente.findAll();
    }

    async actualizarCliente(clienteId, datosCliente) {
        const cliente = await Cliente.findByPk(clienteId);
        if (!cliente) {
            throw new Error('Cliente no encontrado');
        }

        const clienteBuilder = new ClienteBuilder()
            .setNombre(datosCliente.nombre)
            .setApellido(datosCliente.apellido)
            .setCedula(datosCliente.cedula)
            .setEmail(datosCliente.email)
            .setTelefono(datosCliente.telefono)
            .setDireccion(datosCliente.direccion);

        await cliente.update(clienteBuilder.build());
        return cliente;
    }

    async eliminarCliente(clienteId) {
        const cliente = await Cliente.findByPk(clienteId);
        if (!cliente) {
            throw new Error('Cliente no encontrado');
        }

        await cliente.destroy();
        return null;
    }
}

module.exports = new ClienteService();
