const pool = require('../db');

exports.agregarCliente = async (req, res) => {
    const { nombre, apellido, cedula, email, telefono, direccion } = req.body;
    try {
        const consultaSQL = `
            INSERT INTO clientes (nombre, apellido, cedula, email, telefono, direccion) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
        `;
        const valores = [nombre, apellido, cedula, email, telefono, direccion];
        const resultado = await pool.query(consultaSQL, valores);
        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        console.error('Error al agregar cliente:', error.message);
        res.status(500).send('Error al agregar cliente');
    }
};

exports.obtenerClientes = async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM clientes');
        res.status(200).json(resultado.rows);
    } catch (error) {
        console.error('Error al obtener clientes:', error.message);
        res.status(500).send('Error al obtener clientes');
    }
};

exports.actualizarCliente = async (req, res) => {
    const { clienteId } = req.params;
    const actualizaciones = Object.keys(req.body)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(", ");
    const valores = [...Object.values(req.body), clienteId];

    try {
        const consultaSQL = `UPDATE clientes SET ${actualizaciones} WHERE cliente_id = $${valores.length} RETURNING *`;
        const resultado = await pool.query(consultaSQL, valores);
        if (resultado.rows.length > 0) {
            res.status(200).json(resultado.rows[0]);
        } else {
            res.status(404).send('Cliente no encontrado');
        }
    } catch (error) {
        console.error('Error al actualizar cliente:', error.message);
        res.status(500).send('Error al actualizar cliente');
    }
};

exports.eliminarCliente = async (req, res) => {
    const { clienteId } = req.params;
    try {
        const resultado = await pool.query('DELETE FROM clientes WHERE cliente_id = $1', [clienteId]);
        if (resultado.rowCount > 0) {
            res.status(204).send(); // No content
        } else {
            res.status(404).send('Cliente no encontrado');
        }
    } catch (error) {
        console.error('Error al eliminar cliente:', error.message);
        res.status(500).send('Error al eliminar cliente');
    }
};
