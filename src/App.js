import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FormularioProveedor from './components/FormularioProveedor';
import ListaDeProveedores from './components/ListaDeProveedores';
// Importa el componente Home si lo tienes
// import Home from './components/Home';
import './App.css';

const App = () => {
  const [proveedores, setProveedores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const agregarProveedor = (proveedor) => {
    setProveedores([...proveedores, proveedor]);
  };

  const actualizarProveedor = (id, proveedorActualizado) => {
    // Lógica para actualizar el proveedor
  };

  const eliminarProveedor = (id) => {
    // Lógica para eliminar el proveedor
  };

  // Filtro de módulos basado en el término de búsqueda
  const modules = [
    { path: '/', name: 'Inicio' }, // Ruta por defecto al inicio
    // Añade aquí otros módulos si es necesario
  ].filter(module => module.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '20%', background: '#f0f0f0' }}>
          <input
            type="text"
            placeholder="Buscar módulo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <nav>
            <ul>
              {modules.map(module => (
                <li key={module.path}>
                  <Link to={module.path}>{module.name}</Link>
                </li>
              ))}
              <li>
                <Link to="/proveedores">Proveedores</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<div>Inicio</div>} /> {/* Aquí podrías reemplazar <div>Inicio</div> con tu componente Home */}
            <Route path="/proveedores" element={
              <>
                <FormularioProveedor onSubmit={agregarProveedor} />
                <ListaDeProveedores
                  proveedores={proveedores}
                  onUpdate={actualizarProveedor}
                  onDelete={eliminarProveedor}
                />
              </>
            } />
            {/* ... otras rutas */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
