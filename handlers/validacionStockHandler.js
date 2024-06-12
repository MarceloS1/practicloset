const Handler = require('./Handler');
const Stock = require('../models/Stock');

class ValidacionStockHandler extends Handler {
    async handle(request) {
        const { detalles } = request;

        for (let detalle of detalles) {
            const stock = await Stock.findOne({ where: { articulo_id: detalle.articulo_id } });
            if (!stock || stock.cantidad_disponible < detalle.cantidad) {
                throw new Error(`Stock insuficiente para el artículo: ${detalle.articulo_id}`);
            }
        }

        return super.handle(request);
    }
}

module.exports = ValidacionStockHandler;