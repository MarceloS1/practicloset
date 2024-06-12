const Trabajador = require('../models/Trabajador');
const ResponseFactory = require('../helpers/responseFactory');
const TrabajadorBuilder = require('../builders/trabajadorBuilder');

// Agregar un nuevo trabajador
exports.agregarTrabajador = async (req, res) => {
    const { nombre, apellido, cedula, email, telefono, cargo, fecha_ingreso, salario } = req.body;

    try {
        const trabajadorBuilder = new TrabajadorBuilder()
            .setNombre(nombre)
            .setApellido(apellido)
            .setCedula(cedula)
            .setEmail(email)
            .setTelefono(telefono)
            .setCargo(cargo)
            .setFechaIngreso(fecha_ingreso)
            .setSalario(salario);

        const trabajador = await Trabajador.create(trabajadorBuilder.build());

        const respuesta = ResponseFactory.createSuccessResponse(trabajador, 'Trabajador agregado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al agregar trabajador');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Actualizar un trabajador existente
exports.actualizarTrabajador = async (req, res) => {
    const { trabajadorId } = req.params;
    const { nombre, apellido, cedula, email, telefono, cargo, fecha_ingreso, salario } = req.body;

    try {
        const trabajador = await Trabajador.findByPk(trabajadorId);
        if (!trabajador) {
            const respuesta = ResponseFactory.createNotFoundResponse('Trabajador no encontrado');
            return res.status(respuesta.status).json(respuesta.body);
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

        const respuesta = ResponseFactory.createSuccessResponse(trabajador, 'Trabajador actualizado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al actualizar el trabajador');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Obtener todos los trabajadores o un trabajador específico por ID
exports.obtenerTrabajadores = async (req, res) => {
    const { trabajadorId } = req.params;

    try {
        let trabajadores;
        if (trabajadorId) {
            trabajadores = await Trabajador.findByPk(trabajadorId);
            if (!trabajadores) {
                const respuesta = ResponseFactory.createNotFoundResponse('Trabajador no encontrado');
                return res.status(respuesta.status).json(respuesta.body);
            }
        } else {
            trabajadores = await Trabajador.findAll();
        }

        const respuesta = ResponseFactory.createSuccessResponse(trabajadores, 'Trabajador(es) obtenido(s) exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener trabajadores');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Eliminar un trabajador
exports.eliminarTrabajador = async (req, res) => {
    const { trabajadorId } = req.params;

    try {
        const trabajador = await Trabajador.findByPk(trabajadorId);
        if (!trabajador) {
            const respuesta = ResponseFactory.createNotFoundResponse('Trabajador no encontrado');
            return res.status(respuesta.status).json(respuesta.body);
        }

        await trabajador.destroy();
        const respuesta = ResponseFactory.createSuccessResponse(null, 'Trabajador eliminado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al eliminar el trabajador');
        res.status(respuesta.status).json(respuesta.body);
    }
};
