const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

router.post('/', pedidosController.crearPedido); 
router.get('/', pedidosController.obtenerPedidos); 
router.put('/:pedidoId', pedidosController.actualizarPedido); 
router.delete('/:pedidoId', pedidosController.eliminarPedido); 
router.put('/:pedidoId/completarEntrega', pedidosController.completarEntrega);

module.exports = router;
