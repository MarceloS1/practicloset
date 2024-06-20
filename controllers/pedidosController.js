const PedidoService = require('../facades/pedidoService');
const ResponseFactory = require('../helpers/responseFactory');

exports.crearPedido = async (req, res) => {
    try {
        const pedido = await PedidoService.crearPedido(req.body);
        const respuesta = ResponseFactory.createSuccessResponse(pedido, 'Pedido creado y stock actualizado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al crear el pedido y actualizar el stock');
        res.status(respuesta.status).json(respuesta.body);
    }
};

exports.obtenerPedidos = async (req, res) => {
    try {
        const pedidos = await PedidoService.obtenerPedidos();
        const respuesta = ResponseFactory.createSuccessResponse(pedidos, 'Pedidos obtenidos exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener los pedidos');
        res.status(respuesta.status).json(respuesta.body);
    }
};

exports.actualizarPedido = async (req, res) => {
    const { pedidoId } = req.params;
    try {
        const pedido = await PedidoService.actualizarPedido(pedidoId, req.body);
        const respuesta = ResponseFactory.createSuccessResponse(pedido, 'Pedido actualizado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al actualizar el pedido');
        res.status(respuesta.status).json(respuesta.body);
    }
};

exports.eliminarPedido = async (req, res) => {
    const { pedidoId } = req.params;
    try {
        const pedido = await PedidoService.eliminarPedido(pedidoId);
        const respuesta = ResponseFactory.createSuccessResponse(null, 'Pedido eliminado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al eliminar el pedido');
        res.status(respuesta.status).json(respuesta.body);
    }
};

exports.completarEntrega = async (req, res) => {
    const { pedidoId } = req.params;
    const { estado_entrega } = req.body;
    try {
        const pedido = await PedidoService.completarEntrega(pedidoId, estado_entrega);
        const respuesta = ResponseFactory.createSuccessResponse(pedido, 'Estado del pedido actualizado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al actualizar el estado del pedido');
        res.status(respuesta.status).json(respuesta.body);
    }
};
