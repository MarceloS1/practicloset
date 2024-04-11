const { Pool } = require('pg');
const pool = new Pool({
  user: 'Marcelo',
  host: '25.56.40.70',
  database: 'practicloset_db',
  password: 'Passw0rd',
  port: 5433,
});

exports.obtenerCategorias = async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM categorias ORDER BY nombre');
        res.status(200).json(resultado.rows);
    } catch (error) {
        console.error('Error al obtener categorías:', error.message);
        res.status(500).send('Error al obtener categorías');
    }
};