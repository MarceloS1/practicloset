const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

router.post('/', pedidosController.crearPedido); // Crear un nuevo pedido
router.get('/', pedidosController.obtenerPedidos); // Obtener todos los pedidos
router.put('/:pedidoId', pedidosController.actualizarPedido); // Actualizar un pedido existente
router.delete('/:pedidoId', pedidosController.eliminarPedido); // Eliminar un pedido

module.exports = router;
