const { Modelo, Stock }= require('../models')
const ResponseFactory = require('../helpers/responseFactory');
const sequelize = require('../sequelize');
const ModeloBuilder = require('../builders/modeloBuilder');
const StockBuilder = require('../builders/stockBuilder');

// Obtener todos los modelos con stock
exports.obtenerModelos = async (req, res) => {
    try {
        const modelos = await Modelo.findAll({
            include: {
                model: Stock,
                attributes: ['cantidad_disponible', 'cantidad_reservada'],
            },
        });

        const respuesta = ResponseFactory.createSuccessResponse(modelos, 'Modelos obtenidos exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener modelos con stock');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Actualizar un modelo existente
exports.actualizarModelo = async (req, res) => {
    const { modelo_id } = req.params;
    const { nombre, descripcion, categoria_id, material, alto, ancho, precio, imagen_url, cantidad_disponible, cantidad_reservada } = req.body;

    const transaction = await sequelize.transaction();

    try {
        const modelo = await Modelo.findByPk(modelo_id, { transaction });
        if (!modelo) {
            const respuesta = ResponseFactory.createNotFoundResponse('Modelo no encontrado');
            return res.status(respuesta.status).json(respuesta.body);
        }

        const modeloBuilder = new ModeloBuilder()
            .setNombre(nombre)
            .setDescripcion(descripcion)
            .setCategoriaId(categoria_id)
            .setMaterial(material)
            .setAlto(alto)
            .setAncho(ancho)
            .setPrecio(precio)
            .setImagenUrl(imagen_url);

        await modelo.update(modeloBuilder.build(), { transaction });

        const stock = await Stock.findOne({ where: { modelo_id }, transaction });
        const stockBuilder = new StockBuilder()
            .setModeloId(modelo_id)
            .setCantidadDisponible(cantidad_disponible)
            .setCantidadReservada(cantidad_reservada);

        if (stock) {
            await stock.update(stockBuilder.build(), { transaction });
        } else {
            await Stock.create(stockBuilder.build(), { transaction });
        }

        await transaction.commit();

        const respuesta = ResponseFactory.createSuccessResponse(modelo, 'Modelo y stock actualizados exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        await transaction.rollback();
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al actualizar modelo y stock');
        res.status(respuesta.status).json(respuesta.body);
    }
};


// Eliminar un modelo
exports.eliminarModelo = async (req, res) => {
    const { modelo_id } = req.params;

    try {
        const modelo = await Modelo.findByPk(modelo_id);
        if (!modelo) {
            const respuesta = ResponseFactory.createNotFoundResponse('Modelo no encontrado');
            return res.status(respuesta.status).json(respuesta.body);
        }

        await modelo.destroy();
        const respuesta = ResponseFactory.createSuccessResponse(null, 'Modelo eliminado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al eliminar modelo');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Agregar un nuevo modelo y su stock
exports.agregarModelo = async (req, res) => {
    const { nombre, descripcion, categoria_id, material, alto, ancho, precio, imagen_url, cantidad_disponible, cantidad_reservada } = req.body;

    try {
        const result = await sequelize.transaction(async (t) => {
            const modeloBuilder = new ModeloBuilder()
                .setNombre(nombre)
                .setDescripcion(descripcion)
                .setCategoriaId(categoria_id)
                .setMaterial(material)
                .setAlto(alto)
                .setAncho(ancho)
                .setPrecio(precio)
                .setImagenUrl(imagen_url);

            const modelo = await Modelo.create(modeloBuilder.build(), { transaction: t });

            const stockBuilder = new StockBuilder()
                .setModeloId(modelo.modelo_id)
                .setCantidadDisponible(cantidad_disponible)
                .setCantidadReservada(cantidad_reservada);

            await Stock.create(stockBuilder.build(), { transaction: t });

            return modelo;
        });

        const respuesta = ResponseFactory.createSuccessResponse(result, 'Modelo y stock agregados exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al agregar modelo y stock');
        res.status(respuesta.status).json(respuesta.body);
    }
};
