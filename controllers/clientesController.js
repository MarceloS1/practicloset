const pool = require('../db');
const ResponseFactory = require('../helpers/ResponseFactory');

exports.agregarCliente = async (req, res, next) => {
    const { nombre, apellido, cedula, email, telefono, direccion } = req.body;
    try {
        const consultaSQL = `
            INSERT INTO clientes (nombre, apellido, cedula, email, telefono, direccion) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
        `;
        const valores = [nombre, apellido, cedula, email, telefono, direccion];
        const resultado = await pool.query(consultaSQL, valores);
        const respuesta = ResponseFactory.createSuccessResponse(resultado.rows[0], 'Cliente agregado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al agregar cliente');
        res.status(respuesta.status).json(respuesta.body);
    }
};

exports.obtenerClientes = async (req, res, next) => {
    try {
        const resultado = await pool.query('SELECT * FROM clientes');
        const respuesta = ResponseFactory.createSuccessResponse(resultado.rows, 'Clientes obtenidos exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener clientes');
        res.status(respuesta.status).json(respuesta.body);
    }
};

exports.actualizarCliente = async (req, res, next) => {
    const { clienteId } = req.params;
    const actualizaciones = Object.keys(req.body)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(", ");
    const valores = [...Object.values(req.body), clienteId];

    try {
        const consultaSQL = `UPDATE clientes SET ${actualizaciones} WHERE cliente_id = $${valores.length} RETURNING *`;
        const resultado = await pool.query(consultaSQL, valores);
        if (resultado.rows.length > 0) {
            const respuesta = ResponseFactory.createSuccessResponse(resultado.rows[0], 'Cliente actualizado exitosamente');
            res.status(respuesta.status).json(respuesta.body);
        } else {
            const respuesta = ResponseFactory.createNotFoundResponse('Cliente no encontrado');
            res.status(respuesta.status).json(respuesta.body);
        }
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al actualizar cliente');
        res.status(respuesta.status).json(respuesta.body);
    }
};

exports.eliminarCliente = async (req, res, next) => {
    const { clienteId } = req.params;
    try {
        const resultado = await pool.query('DELETE FROM clientes WHERE cliente_id = $1', [clienteId]);
        if (resultado.rowCount > 0) {
            const respuesta = ResponseFactory.createSuccessResponse(null, 'Cliente eliminado exitosamente');
            res.status(respuesta.status).json(respuesta.body);
        } else {
            const respuesta = ResponseFactory.createNotFoundResponse('Cliente no encontrado');
            res.status(respuesta.status).json(respuesta.body);
        }
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al eliminar cliente');
        res.status(respuesta.status).json(respuesta.body);
    }
};
