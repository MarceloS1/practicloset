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
    res.status(500).send(error.message);
  }
};

exports.crearProveedor = async (req, res) => {
    const campos = [];
    const valores = [];
    const parametros = [];
    Object.entries(req.body).forEach(([campo, valor], index) => {
      campos.push(campo);
      valores.push(valor);
      parametros.push(`$${index + 1}`);
    });
  
    const consultaSQL = `INSERT INTO proveedores (${campos.join(', ')}) VALUES (${parametros.join(', ')}) RETURNING *`;
  
    try {
      const resultado = await pool.query(consultaSQL, valores);
      res.status(201).json(resultado.rows[0]);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  exports.actualizarProveedor = async (req, res) => {
    const id = parseInt(req.params.proveedor_id);
    const actualizaciones = [];
    const valores = [];
    Object.entries(req.body).forEach(([campo, valor], index) => {
      actualizaciones.push(`${campo} = $${index + 1}`);
      valores.push(valor);
    });
    valores.push(id);
  
    const consultaSQL = `UPDATE proveedores SET ${actualizaciones.join(', ')} WHERE proveedor_id = $${valores.length} RETURNING *`;
  
    try {
      const resultado = await pool.query(consultaSQL, valores);
      if (resultado.rows.length > 0) {
        res.status(200).json(resultado.rows[0]);
      } else {
        res.status(404).send('Proveedor no encontrado');
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  exports.eliminarProveedor = async (req, res) => {
    const id = parseInt(req.params.proveedor_id);

    if (isNaN(id)) {
      return res.status(400).send("El ID del proveedor debe ser un número entero.");
    }
  
    try {
      const resultado = await pool.query('DELETE FROM proveedores WHERE proveedor_id = $1', [id]);
      if (resultado.rowCount > 0) {
        res.status(204).send();
      } else {
        res.status(404).send('Proveedor no encontrado');
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
