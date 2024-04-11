const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');

router.get('/', productosController.obtenerProductos);
router.put('/:producto_id', productosController.actualizarProducto);
router.delete('/:producto_id', productosController.eliminarProducto);
router.post('/', productosController.agregarProductoYStock);

module.exports = router;
