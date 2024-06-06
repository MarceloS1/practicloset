const express = require('express');
const informesController = require('../controllers/informesController');

const router = express.Router();

router.get('/ventas', informesController.generarInformeVentas);
router.get('/inventario', informesController.generarInformeInventario);
router.get('/clientes', informesController.generarInformeClientes);

module.exports = router;
