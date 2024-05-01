const { Pool } = require('pg');
const pool = new Pool({
  user: 'Marcelo',
  host: '25.56.40.70',
  database: 'practicloset_db',
  password: 'Passw0rd',
  port: 5433,
});

// Agregar un nuevo modelo
exports.agregarModelo = async (req, res) => {
    const { nombre, tipo, descripcion, material, alto, ancho, precio, imagen_url } = req.body;
    try {
        const consultaSQL = `
            INSERT INTO modelos (nombre, tipo, descripcion, material, alto, ancho, precio, imagen_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const resultado = await pool.query(consultaSQL, [nombre, tipo, descripcion, material, alto, ancho, precio, imagen_url]);
        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        console.error('Error al agregar modelo:', error);
        res.status(500).send('Error al agregar modelo');
    }
};

// Obtener todos los modelos
exports.obtenerModelos = async (req, res) => {
    try {
        const consultaSQL = 'SELECT * FROM modelos';
        const resultado = await pool.query(consultaSQL);
        res.status(200).json(resultado.rows);
    } catch (error) {
        console.error('Error al obtener modelos:', error);
        res.status(500).send('Error al obtener modelos');
    }
};

// Actualizar un modelo específico
exports.actualizarModelo = async (req, res) => {
    const { modelo_id } = req.params;
    const { nombre, tipo, descripcion, material, alto, ancho, precio, imagen_url } = req.body;
    try {
        const consultaSQL = `
            UPDATE modelos SET nombre = $1, tipo = $2, descripcion = $3, material = $4, alto = $5, ancho = $6, precio = $7, imagen_url = $8
            WHERE modelo_id = $9
            RETURNING *;
        `;
        const resultado = await pool.query(consultaSQL, [nombre, tipo, descripcion, material, alto, ancho, precio, imagen_url, modelo_id]);
        if (resultado.rows.length > 0) {
            res.status(200).json(resultado.rows[0]);
        } else {
            res.status(404).send('Modelo no encontrado');
        }
    } catch (error) {
        console.error('Error al actualizar modelo:', error);
        res.status(500).send('Error al actualizar modelo');
    }
};

// Eliminar un modelo específico
exports.eliminarModelo = async (req, res) => {
    const { modelo_id } = req.params;
    try {
        const consultaSQL = `DELETE FROM modelos WHERE modelo_id = $1 RETURNING *;`;
        const resultado = await pool.query(consultaSQL, [modelo_id]);
        if (resultado.rowCount > 0) {
            res.status(204).send(); // No Content, successful deletion
        } else {
            res.status(404).send('Modelo no encontrado');
        }
    } catch (error) {
        console.error('Error al eliminar modelo:', error);
        res.status(500).send('Error al eliminar modelo');
    }
};
