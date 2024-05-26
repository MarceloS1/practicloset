const express = require('express');
const cors = require('cors');
const sequelize = require('./sequelize'); 
const ResponseFactory = require('./helpers/ResponseFactory');
const routes = require('./indexRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Permite que el servidor acepte JSON.

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('El servidor está funcionando');
});

// Rutas
app.use('/', routes);

// Middleware de manejo de errores
app.use((error, req, res, next) => {
  console.error(error);  // Registro del error para depuración interna
  const respuesta = ResponseFactory.createErrorResponse(error);
  res.status(respuesta.status).json(respuesta.body);
});

// Sincronizar la base de datos e iniciar el servidor
sequelize.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error al sincronizar la base de datos:', err);
  });
