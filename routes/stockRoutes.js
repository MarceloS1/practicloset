const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.put('/:producto_id', stockController.actualizarStock);
router.delete('/:producto_id', stockController.eliminarStock);

module.exports = router;
