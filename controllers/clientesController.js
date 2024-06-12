const Cliente = require('../models/Cliente');
const ResponseFactory = require('../helpers/responseFactory');
const ClienteBuilder = require('../builders/clienteBuilder');

// Crear un nuevo cliente
exports.agregarCliente = async (req, res, next) => {
    const { nombre, apellido, cedula, email, telefono, direccion } = req.body;
    try {
        const clienteBuilder = new ClienteBuilder()
            .setNombre(nombre)
            .setApellido(apellido)
            .setCedula(cedula)
            .setEmail(email)
            .setTelefono(telefono)
            .setDireccion(direccion);

        const cliente = await Cliente.create(clienteBuilder.build());
        const respuesta = ResponseFactory.createSuccessResponse(cliente, 'Cliente agregado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al agregar cliente');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Obtener todos los clientes
exports.obtenerClientes = async (req, res, next) => {
    try {
        const clientes = await Cliente.findAll();
        const respuesta = ResponseFactory.createSuccessResponse(clientes, 'Clientes obtenidos exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener clientes');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Actualizar un cliente existente
exports.actualizarCliente = async (req, res, next) => {
    const { clienteId } = req.params;
    const { nombre, apellido, cedula, email, telefono, direccion } = req.body;
    try {
        const cliente = await Cliente.findByPk(clienteId);
        if (!cliente) {
            const respuesta = ResponseFactory.createNotFoundResponse('Cliente no encontrado');
            return res.status(respuesta.status).json(respuesta.body);
        }

        const clienteBuilder = new ClienteBuilder()
            .setNombre(nombre)
            .setApellido(apellido)
            .setCedula(cedula)
            .setEmail(email)
            .setTelefono(telefono)
            .setDireccion(direccion);

        await cliente.update(clienteBuilder.build());
        const respuesta = ResponseFactory.createSuccessResponse(cliente, 'Cliente actualizado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al actualizar cliente');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Eliminar un cliente
exports.eliminarCliente = async (req, res, next) => {
    const { clienteId } = req.params;
    try {
        const cliente = await Cliente.findByPk(clienteId);
        if (!cliente) {
            const respuesta = ResponseFactory.createNotFoundResponse('Cliente no encontrado');
            return res.status(respuesta.status).json(respuesta.body);
        }
        await cliente.destroy();
        const respuesta = ResponseFactory.createSuccessResponse(null, 'Cliente eliminado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al eliminar cliente');
        res.status(respuesta.status).json(respuesta.body);
    }
};
