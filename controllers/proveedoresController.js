const Proveedor = require('../models/Proveedor');
const ResponseFactory = require('../helpers/responseFactory');

// Obtener todos los proveedores
exports.obtenerProveedores = async (req, res) => {
    try {
        const proveedores = await Proveedor.findAll();
        const respuesta = ResponseFactory.createSuccessResponse(proveedores, 'Proveedores obtenidos exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener proveedores');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Crear un nuevo proveedor
exports.crearProveedor = async (req, res) => {
    const { nombre, direccion, telefono, email, comentario, tiempo_entrega_estimado } = req.body;

    try {
        const proveedor = await Proveedor.create({
            nombre,
            direccion,
            telefono,
            email,
            comentario,
            tiempo_entrega_estimado,
        });
        const respuesta = ResponseFactory.createSuccessResponse(proveedor, 'Proveedor creado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al crear proveedor');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Actualizar un proveedor existente
exports.actualizarProveedor = async (req, res) => {
    const { proveedor_id } = req.params;
    const { nombre, direccion, telefono, email, comentario, tiempo_entrega_estimado } = req.body;

    try {
        const proveedor = await Proveedor.findByPk(proveedor_id);
        if (!proveedor) {
            const respuesta = ResponseFactory.createNotFoundResponse('Proveedor no encontrado');
            return res.status(respuesta.status).json(respuesta.body);
        }

        await proveedor.update({
            nombre,
            direccion,
            telefono,
            email,
            comentario,
            tiempo_entrega_estimado,
        });

        const respuesta = ResponseFactory.createSuccessResponse(proveedor, 'Proveedor actualizado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al actualizar proveedor');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Eliminar un proveedor
exports.eliminarProveedor = async (req, res) => {
    const { proveedor_id } = req.params;

    try {
        const proveedor = await Proveedor.findByPk(proveedor_id);
        if (!proveedor) {
            const respuesta = ResponseFactory.createNotFoundResponse('Proveedor no encontrado');
            return res.status(respuesta.status).json(respuesta.body);
        }

        await proveedor.destroy();
        const respuesta = ResponseFactory.createSuccessResponse(null, 'Proveedor eliminado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al eliminar proveedor');
        res.status(respuesta.status).json(respuesta.body);
    }
};
