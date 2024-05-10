const pool = require('../db');

exports.obtenerCategorias = async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM categorias ORDER BY nombre');
        res.status(200).json(resultado.rows);
    } catch (error) {
        console.error('Error al obtener categorías:', error.message);
        res.status(500).send('Error al obtener categorías');
    }
};