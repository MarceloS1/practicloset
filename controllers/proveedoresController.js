const { Pool } = require('pg');
const pool = new Pool({
    user: 'Marcelo',
    host: '25.56.40.70',
    database: 'practicloset_db',
    password: 'Passw0rd',
    port: 5433,
});

// Obtener todos los proveedores
exports.obtenerProveedores = async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM proveedores');
        res.status(200).json(resultado.rows);
    } catch (error) {
        console.error('Error al obtener proveedores:', error.message);
        res.status(500).send('Error al obtener proveedores');
    }
};

exports.crearProveedor = async (req, res) => {
    const campos = Object.keys(req.body);
    const valores = Object.values(req.body);
    const parametros = campos.map((_, index) => `$${index + 1}`).join(', ');

    const consultaSQL = `INSERT INTO proveedores (${campos.join(', ')}) VALUES (${parametros}) RETURNING *`;

    try {
        const resultado = await pool.query(consultaSQL, valores);
        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        console.error('Error al crear proveedor:', error.message);
        res.status(500).send('Error al crear proveedor');
    }
};

exports.actualizarProveedor = async (req, res) => {
    const id = parseInt(req.params.proveedor_id);
    const actualizaciones = Object.entries(req.body)
        .map(([campo, valor], index) => `${campo} = $${index + 1}`)
        .join(', ');
    const valores = [...Object.values(req.body), id];

    if (isNaN(id)) {
        return res.status(400).send("El ID del proveedor debe ser un número entero.");
    }

    const consultaSQL = `UPDATE proveedores SET ${actualizaciones} WHERE proveedor_id = $${valores.length} RETURNING *`;

    try {
        const resultado = await pool.query(consultaSQL, valores);
        if (resultado.rows.length > 0) {
            res.status(200).json(resultado.rows[0]);
        } else {
            res.status(404).send('Proveedor no encontrado');
        }
    } catch (error) {
        console.error('Error al actualizar proveedor:', error.message);
        res.status(500).send('Error al actualizar proveedor');
    }
};

exports.eliminarProveedor = async (req, res) => {
    const id = parseInt(req.params.proveedor_id);

    try {
        const resultado = await pool.query('DELETE FROM proveedores WHERE proveedor_id = $1', [id]);
        if (resultado.rowCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).send('Proveedor no encontrado');
        }
    } catch (error) {
        console.error('Error al eliminar proveedor:', error.message);
        res.status(500).send('Error al eliminar proveedor');
    }
};
