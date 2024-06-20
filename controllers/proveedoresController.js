const ProveedorService = require('../facades/proveedorService');
const ResponseFactory = require('../helpers/responseFactory');

exports.obtenerProveedores = async (req, res) => {
    try {
        const proveedores = await ProveedorService.obtenerProveedores();
        const respuesta = ResponseFactory.createSuccessResponse(proveedores, 'Proveedores obtenidos exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener proveedores');
        res.status(respuesta.status).json(respuesta.body);
    }
};

exports.crearProveedor = async (req, res) => {
    try {
        const proveedor = await ProveedorService.crearProveedor(req.body);
        const respuesta = ResponseFactory.createSuccessResponse(proveedor, 'Proveedor creado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al crear proveedor');
        res.status(respuesta.status).json(respuesta.body);
    }
};

exports.actualizarProveedor = async (req, res) => {
    const { proveedor_id } = req.params;
    try {
        const proveedor = await ProveedorService.actualizarProveedor(proveedor_id, req.body);
        const respuesta = ResponseFactory.createSuccessResponse(proveedor, 'Proveedor actualizado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al actualizar proveedor');
        res.status(respuesta.status).json(respuesta.body);
    }
};

exports.eliminarProveedor = async (req, res) => {
    const { proveedor_id } = req.params;
    try {
        await ProveedorService.eliminarProveedor(proveedor_id);
        const respuesta = ResponseFactory.createSuccessResponse(null, 'Proveedor eliminado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al eliminar proveedor');
        res.status(respuesta.status).json(respuesta.body);
    }
};
