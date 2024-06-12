const Modelo = require('../models/Modelo');
const Stock = require('../models/Stock');
const ResponseFactory = require('../helpers/responseFactory');
const sequelize = require('../sequelize');

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

        await modelo.update({ nombre, descripcion, categoria_id, material, alto, ancho, precio, imagen_url }, { transaction });

        const stock = await Stock.findOne({ where: { modelo_id }, transaction });
        if (stock) {
            await stock.update({ cantidad_disponible, cantidad_reservada }, { transaction });
        } else {
            await Stock.create({ modelo_id, cantidad_disponible, cantidad_reservada }, { transaction });
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
            const modelo = await Modelo.create({
                nombre,
                descripcion,
                categoria_id,
                material,
                alto,
                ancho,
                precio,
                imagen_url,
            }, { transaction: t });

            await Stock.create({
                modelo_id: modelo.modelo_id,
                cantidad_disponible,
                cantidad_reservada,
            }, { transaction: t });

            return modelo;
        });

        const respuesta = ResponseFactory.createSuccessResponse(result, 'Modelo y stock agregados exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al agregar modelo y stock');
        res.status(respuesta.status).json(respuesta.body);
    }
};
