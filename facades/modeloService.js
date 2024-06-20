const { Modelo, Stock } = require('../models');
const sequelize = require('../sequelize');
const ModeloBuilder = require('../builders/modeloBuilder');
const StockBuilder = require('../builders/stockBuilder');

class ModeloService {
    async obtenerModelos() {
        return await Modelo.findAll({
            include: {
                model: Stock,
                attributes: ['cantidad_disponible', 'cantidad_reservada'],
            },
        });
    }

    async actualizarModelo(modelo_id, data) {
        const { nombre, descripcion, categoria_id, material, alto, ancho, precio, imagen_url, cantidad_disponible, cantidad_reservada } = data;

        const transaction = await sequelize.transaction();

        try {
            const modelo = await Modelo.findByPk(modelo_id, { transaction });
            if (!modelo) {
                throw new Error('Modelo no encontrado');
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

            return modelo;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async eliminarModelo(modelo_id) {
        const modelo = await Modelo.findByPk(modelo_id);
        if (!modelo) {
            throw new Error('Modelo no encontrado');
        }

        await modelo.destroy();
        return null;
    }

    async agregarModelo(data) {
        const { nombre, descripcion, categoria_id, material, alto, ancho, precio, imagen_url, cantidad_disponible, cantidad_reservada } = data;

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

        return result;
    }
}

module.exports = new ModeloService();
