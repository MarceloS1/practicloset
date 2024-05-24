const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagosController');

router.post('/', pagosController.crearPago); // Crear un nuevo pago y actualizar el estado del pedido
router.get('/', pagosController.obtenerPagos); // Obtener todos los pagos
router.put('/:pagoId', pagosController.actualizarPago); // Actualizar un pago existente
router.delete('/:pagoId', pagosController.eliminarPago); // Eliminar un pago

module.exports = router;
