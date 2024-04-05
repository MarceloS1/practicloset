const express = require('express');
const router = express.Router();
const ordenesController = require('../controllers/ordenesController');


router.get('/', ordenesController.obtenerOrdenes);
router.get('/:ordenId', ordenesController.obtenerOrdenPorId);
router.post('/', ordenesController.crearOrden);
router.put('/:ordenId', ordenesController.actualizarOrden);
router.delete('/:ordenId', ordenesController.eliminarOrden);
router.post('/:ordenId/detalles', ordenesController.agregarDetalleAOrden);
router.put('/detalles/:detalleId', ordenesController.actualizarDetalleOrden);
router.delete('/detalles/:detalleId', ordenesController.eliminarDetalleOrden);
router.get('/:ordenId/detalleConPrecio', ordenesController.obtenerDetalleOrdenConPrecio);

module.exports = router;
