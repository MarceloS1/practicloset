const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.put('/modelo/:modelo_id', stockController.actualizarStock);
router.put('/articulo/:articulo_id', stockController.actualizarStock);
router.delete('/modelo/:modelo_id', stockController.eliminarStock);
router.delete('/articulo/:articulo_id', stockController.eliminarStock);

module.exports = router;
