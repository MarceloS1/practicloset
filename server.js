const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const proveedoresRoutes = require('./routes/proveedoresRoutes');
const articulosRoutes = require('./routes/articulosRoutes');
const ordenesRoutes = require('./routes/ordenesRoutes');


const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Permite que el servidor acepte JSON.

// Configura la conexión a PostgreSQL
const pool = new Pool({
  user: 'Marcelo',
  host: '25.56.40.70',
  database: 'practicloset_db',
  password: 'Passw0rd',
  port: 5433,
});

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('El servidor está funcionando');
});

app.use('/proveedores', proveedoresRoutes);
app.use('/articulos', articulosRoutes);
app.use('/ordenes', ordenesRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
