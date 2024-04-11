const express = require('express');
const router = express.Router();
const transaccionesInventarioController = require('../controllers/transaccionesInvController');

router.post('/', transaccionesInventarioController.agregarTransaccionYActualizarStock);

module.exports = router;
