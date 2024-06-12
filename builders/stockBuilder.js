class StockBuilder {
    constructor() {
        this.stock = {};
    }

    setModeloId(modelo_id) {
        this.stock.modelo_id = modelo_id;
        return this;
    }

    setArticuloId(articulo_id) {
        this.stock.articulo_id = articulo_id;
        return this;
    }

    setCantidadDisponible(cantidad_disponible) {
        this.stock.cantidad_disponible = cantidad_disponible;
        return this;
    }

    setCantidadReservada(cantidad_reservada) {
        this.stock.cantidad_reservada = cantidad_reservada;
        return this;
    }

    // Añade aquí más métodos si el modelo de Stock tiene más campos

    build() {
        return this.stock;
    }
}

module.exports = StockBuilder;
