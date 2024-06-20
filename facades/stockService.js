const Stock = require('../models/Stock');
const StockBuilder = require('../builders/stockBuilder');

class StockService {
    async actualizarStock(params, data) {
        const { modelo_id, articulo_id } = params;
        const { cantidad_disponible, cantidad_reservada } = data;

        let stock;
        if (modelo_id) {
            stock = await Stock.findOne({ where: { modelo_id } });
        } else if (articulo_id) {
            stock = await Stock.findOne({ where: { articulo_id } });
        }

        if (!stock) {
            throw new Error('Stock no encontrado');
        }

        const stockBuilder = new StockBuilder()
            .setCantidadDisponible(cantidad_disponible)
            .setCantidadReservada(cantidad_reservada);

        if (modelo_id) {
            stockBuilder.setModeloId(modelo_id);
        }
        if (articulo_id) {
            stockBuilder.setArticuloId(articulo_id);
        }

        await stock.update(stockBuilder.build());
        return stock;
    }

    async eliminarStock(producto_id) {
        const stock = await Stock.findOne({ where: { producto_id } });

        if (!stock) {
            throw new Error('Stock no encontrado');
        }

        await stock.destroy();
        return stock;
    }
}

module.exports = new StockService();
