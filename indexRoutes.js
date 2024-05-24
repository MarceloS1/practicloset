const express = require('express');

const proveedoresRoutes = require('./routes/proveedoresRoutes');
const articulosRoutes = require('./routes/articulosRoutes');
const ordenesRoutes = require('./routes/ordenesRoutes');
const trabajadoresRoutes = require("./routes/trabajadoresRoutes");
const clientesRoutes = require('./routes/clientesRoutes');
const productosRoutes = require('./routes/productosRoutes');
const categoriasRoutes = require('./routes/categoriasRoutes');
const stockRoutes = require('./routes/stockRoutes');
const transaccionesInvRoutes = require('./routes/transaccionesInvRoutes');
const modelosRoutes = require('./routes/modelosRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');
const pagosRoutes = require('./routes/pagosRoutes');

const router = express.Router();

router.use('/proveedores', proveedoresRoutes);
router.use('/articulos', articulosRoutes);
router.use('/ordenes', ordenesRoutes);
router.use('/trabajadores', trabajadoresRoutes);
router.use('/clientes', clientesRoutes);
router.use('/productos', productosRoutes);
router.use('/categorias', categoriasRoutes);
router.use('/stock', stockRoutes);
router.use('/transaccion', transaccionesInvRoutes);
router.use('/modelos', modelosRoutes);
router.use('/pedidos', pedidosRoutes);
router.use('/pagos', pagosRoutes);

module.exports = router;