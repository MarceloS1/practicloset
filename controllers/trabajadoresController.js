const pool = require('../db');

exports.agregarTrabajador = async (req, res) => {
    const campos = req.body;
    const columnas = Object.keys(campos).join(", ");
    const valores = Object.values(campos);
    const placeholders = valores.map((_, index) => `$${index + 1}`).join(", ");

    try {
        const consultaSQL = `INSERT INTO trabajadores (${columnas}) VALUES (${placeholders}) RETURNING *`;
        const resultado = await pool.query(consultaSQL, valores);
        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        console.error('Error al agregar trabajador:', error);
        res.status(500).send('Error al agregar trabajador');
    }
};

exports.actualizarTrabajador = async (req, res) => {
    const { trabajadorId } = req.params;
    const campos = req.body;

    const actualizaciones = Object.keys(campos)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(", ");

    const valores = Object.values(campos);

    if (valores.length === 0) {
        return res.status(400).send('No hay datos para actualizar.');
    }

    try {
        const consultaSQL = `UPDATE trabajadores SET ${actualizaciones} WHERE trabajador_id = $${valores.length + 1} RETURNING *`;
        const resultado = await pool.query(consultaSQL, [...valores, trabajadorId]);

        if (resultado.rows.length > 0) {
            res.status(200).json(resultado.rows[0]);
        } else {
            res.status(404).send('Trabajador no encontrado.');
        }
    } catch (error) {
        console.error('Error al actualizar el trabajador:', error);
        res.status(500).send('Error al actualizar el trabajador');
    }
};

exports.obtenerTrabajadores = async (req, res) => {
    const { id } = req.params;
    try {
        let consultaSQL, resultado;

        if (id) {
            consultaSQL = 'SELECT * FROM trabajadores WHERE trabajador_id = $1';
            resultado = await pool.query(consultaSQL, [id]);
        } else {
            consultaSQL = 'SELECT * FROM trabajadores';
            resultado = await pool.query(consultaSQL);
        }

        if (resultado.rows.length > 0) {
            res.status(200).json(resultado.rows);
        } else {
            res.status(404).send('Trabajador(es) no encontrado(s)');
        }
    } catch (error) {
        console.error('Error al obtener trabajadores:', error);
        res.status(500).send('Error al obtener trabajadores');
    }
};

exports.eliminarTrabajador = async (req, res) => {
    const { trabajadorId } = req.params; 
    try {
        const resultado = await pool.query('DELETE FROM trabajadores WHERE trabajador_id = $1', [trabajadorId]);
        if (resultado.rowCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).send('Trabajador no encontrado.');
        }
    } catch (error) {
        console.error('Error al eliminar el trabajador:', error);
        res.status(500).send('Error al eliminar el trabajador');
    }
};