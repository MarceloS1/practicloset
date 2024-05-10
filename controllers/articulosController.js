const pool = require('../db');

// Obtener todos los artículos
exports.obtenerArticulos = async (req, res) => {
    try {
      const resultado = await pool.query('SELECT * FROM articulos');
      res.status(200).json(resultado.rows);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  
  // Crear un nuevo artículo
  exports.crearArticulo = async (req, res) => {
    const camposPermitidos = ['nombre', 'precio', 'tipo', 'proveedor_id'];
    const camposAInsertar = Object.keys(req.body).filter(campo => camposPermitidos.includes(campo) && req.body[campo] != null);
    
    // No proceder si no hay campos válidos para insertar
    if (camposAInsertar.length === 0) {
      return res.status(400).send('No hay campos válidos para insertar.');
    }
  
    const valores = camposAInsertar.map(campo => req.body[campo]);
    const camposSQL = camposAInsertar.join(', ');
    const valoresParametrosSQL = camposAInsertar.map((_, index) => `$${index + 1}`).join(', ');
  
    try {
      const consultaSQL = `INSERT INTO articulos (${camposSQL}) VALUES (${valoresParametrosSQL}) RETURNING *`;
      const resultado = await pool.query(consultaSQL, valores);
      res.status(201).json(resultado.rows[0]);
    } catch (error) {
      console.error('Error al crear el artículo:', error);
      res.status(500).send(error.message);
    }
  };
  
  
  // Actualizar un artículo existente
  exports.actualizarArticulo = async (req, res) => {
    const { articulo_id } = req.params;
    const camposPermitidos = ['nombre', 'precio', 'tipo', 'proveedor_id'];
    const camposAActualizar = Object.keys(req.body).filter(campo => camposPermitidos.includes(campo) && req.body[campo] != null);
    
    // No proceder si no hay campos válidos para actualizar
    if (camposAActualizar.length === 0) {
      return res.status(400).send('No hay campos válidos para actualizar.');
    }
  
    const valores = camposAActualizar.map(campo => req.body[campo]);
    const setSQL = camposAActualizar.map((campo, index) => `${campo} = $${index + 1}`).join(', ');
  
    try {
      const consultaSQL = `UPDATE articulos SET ${setSQL} WHERE articulo_id = $${camposAActualizar.length + 1} RETURNING *`;
      const resultado = await pool.query(consultaSQL, [...valores, articulo_id]);
  
      if (resultado.rows.length > 0) {
        res.status(200).json(resultado.rows[0]);
      } else {
        res.status(404).send('Artículo no encontrado');
      }
    } catch (error) {
      console.error('Error al actualizar el artículo:', error);
      res.status(500).send(error.message);
    }
  };
  
  
  // Eliminar un artículo
  exports.eliminarArticulo = async (req, res) => {
    const { articulo_id } = req.params;
    try {
      const resultado = await pool.query('DELETE FROM articulos WHERE articulo_id = $1', [articulo_id]);
      if (resultado.rowCount > 0) {
        res.status(204).send();
      } else {
        res.status(404).send('Artículo no encontrado');
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  
  // Obtener artículos con información del proveedor
  exports.obtenerArticulosConProveedores = async (req, res) => {
    try {
      const result = await pool.query('SELECT articulos.articulo_id, articulos.nombre, articulos.precio, articulos.tipo, proveedores.nombre AS nombre_proveedor FROM articulos JOIN proveedores ON articulos.proveedor_id = proveedores.proveedor_id');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al obtener los artículos con proveedores');
    }
  };