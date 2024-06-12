const Handler = require('./Handler');
const Articulo = require('../models/Articulo');

class CalculoPrecioHandler extends Handler {
    async handle(request) {
        const { detalles } = request;
        let precioTotal = 0;

        for (let detalle of detalles) {
            const articulo = await Articulo.findByPk(detalle.articulo_id);
            precioTotal += articulo.precio * detalle.cantidad;
        }

        request.precioTotal = precioTotal;
        return super.handle(request);
    }
}

module.exports = CalculoPrecioHandler;