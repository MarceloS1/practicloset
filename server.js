const express = require('express');
const cors = require('cors');
const pool = require('./db');
const proveedoresRoutes = require('./routes/proveedoresRoutes');
const articulosRoutes = require('./routes/articulosRoutes');
const ordenesRoutes = require('./routes/ordenesRoutes');
const trabajadoresRoutes = require("./routes/trabajadoresRoutes");
const clientesRoutes = require('./routes/clientesRoutes');
const productosRoutes = require('./routes/productosRoutes');
const categoriasController = require('./routes/categoriasRoutes');
const stockController = require('./routes/stockRoutes');
const transaccionesInvController = require('./routes/transaccionesInvRoutes');
const modelosController = require('./routes/modelosRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Permite que el servidor acepte JSON.


// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('El servidor está funcionando');
});

app.use('/proveedores', proveedoresRoutes);
app.use('/articulos', articulosRoutes);
app.use('/ordenes', ordenesRoutes);
app.use('/trabajadores', trabajadoresRoutes);
app.use('/clientes', clientesRoutes);
app.use('/productos', productosRoutes);
app.use('/categorias', categoriasController);
app.use('/stock', stockController);
app.use('/transaccion', transaccionesInvController);
app.use('/modelos', modelosController);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
