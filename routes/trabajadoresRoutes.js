const express = require('express');
const router = express.Router();
const trabajadoresController = require('../controllers/trabajadoresController');

router.post('/', trabajadoresController.agregarTrabajador);
router.get('/', trabajadoresController.obtenerTrabajadores);
router.put('/:trabajadorId', trabajadoresController.actualizarTrabajador);
router.delete('/:trabajadorId', trabajadoresController.eliminarTrabajador);

module.exports = router;
