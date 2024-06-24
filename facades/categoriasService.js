const { Categoria } = require('../models');

class CategoriaService {
    async obtenerCategorias() {
        return await Categoria.findAll();
    }
}

module.exports = new CategoriaService();