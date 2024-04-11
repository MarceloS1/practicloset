const { Pool } = require('pg');
const pool = new Pool({
  user: 'Marcelo',
  host: '25.56.40.70',
  database: 'practicloset_db',
  password: 'Passw0rd',
  port: 5433,
});

exports.actualizarStock = async (req, res) => {
    const { producto_id } = req.params;
    const { cantidad_disponible, cantidad_reservada } = req.body;

    try {
        const consultaSQL = `
            UPDATE stock
            SET cantidad_disponible = $1, cantidad_reservada = $2
            WHERE producto_id = $3
            RETURNING *;
        `;
        const resultado = await pool.query(consultaSQL, [cantidad_disponible, cantidad_reservada, producto_id]);

        if (resultado.rows.length > 0) {
            res.status(200).json(resultado.rows[0]);
        } else {
            res.status(404).send('Stock no encontrado');
        }
    } catch (error) {
        console.error('Error al actualizar stock:', error);
        res.status(500).send('Error al actualizar stock');
    }
};

exports.eliminarStock = async (req, res) => {
    const { producto_id } = req.params;

    try {
        const consultaSQL = `
            DELETE FROM stock
            WHERE producto_id = $1
            RETURNING *;
        `;
        const resultado = await pool.query(consultaSQL, [producto_id]);

        if (resultado.rowCount > 0) {
            res.status(204).send(); // No Content
        } else {
            res.status(404).send('Stock no encontrado');
        }
    } catch (error) {
        console.error('Error al eliminar stock:', error);
        res.status(500).send('Error al eliminar stock');
    }
};