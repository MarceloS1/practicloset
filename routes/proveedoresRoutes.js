const express = require('express');
const router = express.Router();
const proveedoresController = require('../controllers/proveedoresController');

router.get('/', proveedoresController.obtenerProveedores);
router.post('/', proveedoresController.crearProveedor);
router.put('/:proveedor_id', proveedoresController.actualizarProveedor);
router.delete('/:proveedor_id', proveedoresController.eliminarProveedor);

module.exports = router;
