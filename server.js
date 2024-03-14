const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const proveedoresRoutes = require('./routes/proveedoresRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Permite que el servidor acepte JSON.

// Configura la conexión a PostgreSQL
const pool = new Pool({
  user: 'Marcelo',
  host: 'localhost',
  database: 'practicloset_db',
  password: 'Passw0rd',
  port: 5433,
});

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('El servidor está funcionando');
});

app.use('/proveedores', proveedoresRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
