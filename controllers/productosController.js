const Producto = require('../models/Producto');
const Stock = require('../models/Stock');
const ResponseFactory = require('../helpers/ResponseFactory');
const sequelize = require('../sequelize');

// Obtener todos los productos con stock
exports.obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll({
            include: {
                model: Stock,
                attributes: ['cantidad_disponible', 'cantidad_reservada'],
            },
        });

        const respuesta = ResponseFactory.createSuccessResponse(productos, 'Productos obtenidos exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener productos con stock');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Actualizar un producto existente
exports.actualizarProducto = async (req, res) => {
    const { producto_id } = req.params;
    const { nombre, descripcion, categoria_id } = req.body;

    try {
        const producto = await Producto.findByPk(producto_id);
        if (!producto) {
            const respuesta = ResponseFactory.createNotFoundResponse('Producto no encontrado');
            return res.status(respuesta.status).json(respuesta.body);
        }

        await producto.update({ nombre, descripcion, categoria_id });
        const respuesta = ResponseFactory.createSuccessResponse(producto, 'Producto actualizado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al actualizar producto');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Eliminar un producto
exports.eliminarProducto = async (req, res) => {
    const { producto_id } = req.params;

    try {
        const producto = await Producto.findByPk(producto_id);
        if (!producto) {
            const respuesta = ResponseFactory.createNotFoundResponse('Producto no encontrado');
            return res.status(respuesta.status).json(respuesta.body);
        }

        await producto.destroy();
        const respuesta = ResponseFactory.createSuccessResponse(null, 'Producto eliminado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al eliminar producto');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Agregar un nuevo producto y su stock
exports.agregarProductoYStock = async (req, res) => {
    const { nombre, descripcion, categoria_id, cantidad_disponible, cantidad_reservada } = req.body;

    try {
        const result = await sequelize.transaction(async (t) => {
            const producto = await Producto.create({
                nombre,
                descripcion,
                categoria_id,
            }, { transaction: t });

            await Stock.create({
                producto_id: producto.producto_id,
                cantidad_disponible,
                cantidad_reservada,
            }, { transaction: t });

            return producto;
        });

        const respuesta = ResponseFactory.createSuccessResponse(result, 'Producto y stock agregados exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al agregar producto y stock');
        res.status(respuesta.status).json(respuesta.body);
    }
};
