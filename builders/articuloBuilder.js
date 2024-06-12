class ArticuloBuilder {
    constructor() {
        this.articulo = {};
    }

    setNombre(nombre) {
        this.articulo.nombre = nombre;
        return this;
    }

    setPrecio(precio) {
        this.articulo.precio = precio;
        return this;
    }

    setTipo(tipo) {
        this.articulo.tipo = tipo;
        return this;
    }

    setProveedorId(proveedor_id) {
        this.articulo.proveedor_id = proveedor_id;
        return this;
    }

    build() {
        return this.articulo;
    }
}

module.exports = ArticuloBuilder;
