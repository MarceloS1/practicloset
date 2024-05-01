const express = require('express');
const router = express.Router();
const modelosController = require('../controllers/modelosController');

router.post('/', modelosController.agregarModelo);
router.get('/', modelosController.obtenerModelos);
router.put('/:modelo_id', modelosController.actualizarModelo);
router.delete('/:modelo_id', modelosController.eliminarModelo);

module.exports = router;
