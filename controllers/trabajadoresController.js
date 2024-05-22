const pool = require('../db');
const ResponseFactory = require('../helpers/ResponseFactory');

// Agregar un nuevo trabajador
exports.agregarTrabajador = async (req, res, next) => {
    const { nombre, apellido, cedula, email, telefono, cargo, fecha_ingreso, salario } = req.body;

    try {
        const consultaSQL = `
            INSERT INTO trabajadores (nombre, apellido, cedula, email, telefono, cargo, fecha_ingreso, salario)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const valores = [nombre, apellido, cedula, email, telefono, cargo, fecha_ingreso, salario];
        const resultado = await pool.query(consultaSQL, valores);
        const respuesta = ResponseFactory.createSuccessResponse(resultado.rows[0], 'Trabajador agregado exitosamente');
        res.status(respuesta.status).json(respuesta.body);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al agregar trabajador');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Actualizar un trabajador existente
exports.actualizarTrabajador = async (req, res, next) => {
    const { trabajadorId } = req.params;
    const { nombre, apellido, cedula, email, telefono, cargo, fecha_ingreso, salario } = req.body;

    try {
        const consultaSQL = `
            UPDATE trabajadores
            SET nombre = COALESCE($1, nombre),
                apellido = COALESCE($2, apellido),
                cedula = COALESCE($3, cedula),
                email = COALESCE($4, email),
                telefono = COALESCE($5, telefono),
                cargo = COALESCE($6, cargo),
                fecha_ingreso = COALESCE($7, fecha_ingreso),
                salario = COALESCE($8, salario)
            WHERE trabajador_id = $9
            RETURNING *;
        `;
        const valores = [nombre, apellido, cedula, email, telefono, cargo, fecha_ingreso, salario, trabajadorId];
        const resultado = await pool.query(consultaSQL, valores);

        if (resultado.rows.length > 0) {
            const respuesta = ResponseFactory.createSuccessResponse(resultado.rows[0], 'Trabajador actualizado exitosamente');
            res.status(respuesta.status).json(respuesta.body);
        } else {
            const respuesta = ResponseFactory.createNotFoundResponse('Trabajador no encontrado');
            res.status(respuesta.status).json(respuesta.body);
        }
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al actualizar el trabajador');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Obtener todos los trabajadores o un trabajador específico por ID
exports.obtenerTrabajadores = async (req, res, next) => {
    const { trabajadorId } = req.params;
    try {
        let consultaSQL, resultado;

        if (trabajadorId) {
            consultaSQL = 'SELECT * FROM trabajadores WHERE trabajador_id = $1';
            resultado = await pool.query(consultaSQL, [trabajadorId]);
        } else {
            consultaSQL = 'SELECT * FROM trabajadores';
            resultado = await pool.query(consultaSQL);
        }

        if (resultado.rows.length > 0) {
            const respuesta = ResponseFactory.createSuccessResponse(resultado.rows, 'Trabajador(es) obtenido(s) exitosamente');
            res.status(respuesta.status).json(respuesta.body);
        } else {
            const respuesta = ResponseFactory.createNotFoundResponse('Trabajador(es) no encontrado(s)');
            res.status(respuesta.status).json(respuesta.body);
        }
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al obtener trabajadores');
        res.status(respuesta.status).json(respuesta.body);
    }
};

// Eliminar un trabajador
exports.eliminarTrabajador = async (req, res, next) => {
    const { trabajadorId } = req.params;
    try {
        const resultado = await pool.query('DELETE FROM trabajadores WHERE trabajador_id = $1 RETURNING *', [trabajadorId]);

        if (resultado.rowCount > 0) {
            const respuesta = ResponseFactory.createSuccessResponse(null, 'Trabajador eliminado exitosamente');
            res.status(respuesta.status).json(respuesta.body);
        } else {
            const respuesta = ResponseFactory.createNotFoundResponse('Trabajador no encontrado');
            res.status(respuesta.status).json(respuesta.body);
        }
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al eliminar el trabajador');
        res.status(respuesta.status).json(respuesta.body);
    }
};
