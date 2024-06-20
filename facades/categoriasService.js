const { Categoria } = require('../models');

class CategoriaService {
    async obtenerCategorias() {
        return await Categoria.findAll({ order: [['nombre', 'ASC']] });
    }
}

module.exports = new CategoriaService();