const { Articulo, Proveedor, Stock } = require('../models');
const ArticuloBuilder = require('../builders/articuloBuilder');

class ArticuloService {
    async obtenerArticulos() {
        return await Articulo.findAll();
    }

    async crearArticulo(data) {
        const { nombre, precio, tipo, proveedor_id } = data;
        const articuloData = new ArticuloBuilder()
            .setNombre(nombre)
            .setPrecio(precio)
            .setTipo(tipo)
            .setProveedorId(proveedor_id)
            .build();
        
        return await Articulo.create(articuloData);
    }

    async actualizarArticulo(id, data) {
        const { nombre, precio, tipo, proveedor_id } = data;
        const articulo = await Articulo.findByPk(id);
        if (!articulo) return null;

        const articuloData = new ArticuloBuilder()
            .setNombre(nombre)
            .setPrecio(precio)
            .setTipo(tipo)
            .setProveedorId(proveedor_id)
            .build();

        await articulo.update(articuloData);
        return articulo;
    }

    async eliminarArticulo(id) {
        const articulo = await Articulo.findByPk(id);
        if (!articulo) return null;

        await articulo.destroy();
        return articulo;
    }

    async obtenerArticulosConProveedores() {
        return await Articulo.findAll({
            include: {
                model: Proveedor,
                attributes: ['nombre'],
            },
        });
    }

    async obtenerArticulosConStock() {
        const articulos = await Articulo.findAll({
            include: [{
                model: Stock,
                attributes: ['cantidad_disponible', 'cantidad_reservada'],
                required: false
            }]
        });

        return articulos.map(articulo => {
            if (!articulo.Stock) {
                articulo.dataValues.Stock = {
                    cantidad_disponible: 0,
                    cantidad_reservada: 0
                };
            }
            return articulo;
        });
    }
}

module.exports = new ArticuloService();
