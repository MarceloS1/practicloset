const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagosController');

router.post('/', pagosController.crearPago); 
router.get('/', pagosController.obtenerPagos); 
router.put('/:pagoId', pagosController.actualizarPago); 
router.delete('/:pagoId', pagosController.eliminarPago); 

module.exports = router;
