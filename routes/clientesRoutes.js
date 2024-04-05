const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');

router.get('/', clientesController.obtenerClientes);
router.post('/', clientesController.agregarCliente);
router.put('/:clienteId', clientesController.actualizarCliente);
router.delete('/:clienteId', clientesController.eliminarCliente);

module.exports = router;
