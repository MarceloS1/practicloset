const { Pool } = require('pg');
const pool = new Pool({
  user: 'Marcelo',
  host: '25.56.40.70',
  database: 'practicloset_db',
  password: 'Passw0rd',
  port: 5433,
});

exports.agregarTransaccionYActualizarStock = async (req, res) => {
    const { producto_id, tipo_transaccion, cantidad, nota } = req.body;

    try {
        await pool.query('BEGIN'); // Iniciar transacción

        // Insertar transacción de inventario
        const insertTransaccionSQL = `
            INSERT INTO transacciones_inventario (producto_id, tipo_transaccion, cantidad, fecha_transaccion, nota)
            VALUES ($1, $2, $3, NOW(), $4);
        `;
        await pool.query(insertTransaccionSQL, [producto_id, tipo_transaccion, cantidad, nota]);

        // Actualizar stock
        let updateStockSQL;
        if (tipo_transaccion === 'entrada') {
            updateStockSQL = 'UPDATE stock SET cantidad_disponible = cantidad_disponible + $1 WHERE producto_id = $2';
        } else if (tipo_transaccion === 'salida') {
            updateStockSQL = 'UPDATE stock SET cantidad_disponible = cantidad_disponible - $1 WHERE producto_id = $2';
        }

        if (updateStockSQL) {
            await pool.query(updateStockSQL, [cantidad, producto_id]);
        }

        await pool.query('COMMIT'); // Finalizar transacción
        res.status(201).send('Transacción y actualización de stock realizadas con éxito');
    } catch (error) {
        await pool.query('ROLLBACK'); // Revertir transacción en caso de error
        console.error('Error al agregar transacción y actualizar stock:', error);
        res.status(500).send('Error al agregar transacción y actualizar stock');
    }
};

