const express = require('express');
const router = express.Router();
const ordenesController = require('../controllers/ordenesController');


router.get('/', ordenesController.obtenerOrdenes);
router.post('/', ordenesController.crearOrden);
router.put('/:ordenId', ordenesController.actualizarOrden);
router.delete('/:ordenId', ordenesController.eliminarOrden);
router.get('/:ordenId/detalleConPrecio', ordenesController.obtenerDetalleOrdenConPrecio);
router.post('/:ordenId/confirmarRecepcion', ordenesController.confirmarRecepcionOrden);

module.exports = router;
