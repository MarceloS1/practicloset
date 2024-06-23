const express = require('express');
const cors = require('cors');
const sequelize = require('./sequelize'); 
const ResponseFactory = require('./helpers/responseFactory');
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

// Endpoints para contar recursos

const Cliente = require('./models/Cliente');  // Importa tu modelo Cliente
const Proveedor = require('./models/Proveedor');  // Importa tu modelo Proveedor
const Articulo = require('./models/Articulo');  // Importa tu modelo Articulo
const Trabajador = require('./models/Trabajador');  // Importa tu modelo Trabajador
const Stock = require('./models/Stock');  // Importa tu modelo Stock
const Modelo = require('./models/Modelo');  // Importa tu modelo Modelo
const Pedido = require('./models/Pedido');  // Importa tu modelo Pedido

// Clientes
app.get('/api/clientes/count', async (req, res) => {
  try {
    const count = await Cliente.count();
    res.json({ count });
  } catch (error) {
    console.error('Error al contar clientes:', error);
    res.status(500).json({ error: 'Error al contar clientes' });
  }
});

// Proveedores
app.get('/api/proveedores/count', async (req, res) => {
  try {
    const count = await Proveedor.count();
    res.json({ count });
  } catch (error) {
    console.error('Error al contar proveedores:', error);
    res.status(500).json({ error: 'Error al contar proveedores' });
  }
});

// Artículos
app.get('/api/articulos/count', async (req, res) => {
  try {
    const count = await Articulo.count();
    res.json({ count });
  } catch (error) {
    console.error('Error al contar artículos:', error);
    res.status(500).json({ error: 'Error al contar artículos' });
  }
});

// Trabajadores
app.get('/api/trabajadores/count', async (req, res) => {
  try {
    const count = await Trabajador.count();
    res.json({ count });
  } catch (error) {
    console.error('Error al contar trabajadores:', error);
    res.status(500).json({ error: 'Error al contar trabajadores' });
  }
});

// Stock
app.get('/api/stock/count', async (req, res) => {
  try {
    const count = await Stock.count();
    res.json({ count });
  } catch (error) {
    console.error('Error al contar stock:', error);
    res.status(500).json({ error: 'Error al contar stock' });
  }
});

// Modelos
app.get('/api/modelos/count', async (req, res) => {
  try {
    const count = await Modelo.count();
    res.json({ count });
  } catch (error) {
    console.error('Error al contar modelos:', error);
    res.status(500).json({ error: 'Error al contar modelos' });
  }
});

// Pedidos
app.get('/api/pedidos/count', async (req, res) => {
  try {
    const count = await Pedido.count();
    res.json({ count });
  } catch (error) {
    console.error('Error al contar pedidos:', error);
    res.status(500).json({ error: 'Error al contar pedidos' });
  }
});

app.get('/api/clientes/count', async (req, res) => {
  // ...
});
app.get('/api/proveedores/count', async (req, res) => {
  // ...
});
app.get('/api/articulos/count', async (req, res) => {
  // ...
});
app.get('/api/trabajadores/count', async (req, res) => {
  // ...
});
app.get('/api/stock/count', async (req, res) => {
  // ...
});
app.get('/api/modelos/count', async (req, res) => {
  // ...
});
app.get('/api/pedidos/count', async (req, res) => {
  // ...
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
