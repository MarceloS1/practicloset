const express = require('express');
const cors = require('cors');
const pool = require('./db');
const routes = require('./indexRoutes')

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Permite que el servidor acepte JSON.


// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('El servidor está funcionando');
});

//Rutas
app.use('/', routes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
