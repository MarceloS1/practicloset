const Trabajador = require('../models/Trabajador');
const ResponseFactory = require('../helpers/responseFactory');

// Agregar un nuevo trabajador
exports.agregarTrabajador = async (req, res) => {
    const { nombre, apellido, cedula, email, telefono, cargo, fecha_ingreso, salario } = req.body;

    try {
        const trabajador = await Trabajador.create({
            nombre,
            apellido,
            cedula,
            email,
            telefono,
            cargo,
            fecha_ingreso,
            salario,
        });
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

        await trabajador.update({
            nombre,
            apellido,
            cedula,
            email,
            telefono,
            cargo,
            fecha_ingreso,
            salario,
        });

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
