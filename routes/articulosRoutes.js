const express = require('express');
const router = express.Router();
const articulosController = require('../controllers/articulosController');

router.get('/', articulosController.obtenerArticulos);
router.post('/', articulosController.crearArticulo);
router.put('/:articulo_id', articulosController.actualizarArticulo);
router.delete('/:articulo_id', articulosController.eliminarArticulo);
router.get('/con-proveedores', articulosController.obtenerArticulosConProveedores);

module.exports = router;
