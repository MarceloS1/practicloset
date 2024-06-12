class ModeloBuilder {
    constructor() {
        this.modelo = {};
    }

    setNombre(nombre) {
        this.modelo.nombre = nombre;
        return this;
    }

    setDescripcion(descripcion) {
        this.modelo.descripcion = descripcion;
        return this;
    }

    setCategoriaId(categoria_id) {
        this.modelo.categoria_id = categoria_id;
        return this;
    }

    setMaterial(material) {
        this.modelo.material = material;
        return this;
    }

    setAlto(alto) {
        this.modelo.alto = alto;
        return this;
    }

    setAncho(ancho) {
        this.modelo.ancho = ancho;
        return this;
    }

    setPrecio(precio) {
        this.modelo.precio = precio;
        return this;
    }

    setImagenUrl(imagen_url) {
        this.modelo.imagen_url = imagen_url;
        return this;
    }

    build() {
        return this.modelo;
    }
}

module.exports = ModeloBuilder;
