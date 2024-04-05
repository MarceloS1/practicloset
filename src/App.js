import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/navbar';
import Proveedores from './components/FormularioProveedor';
import Inicio from './components/Inicio';
import Articulos from './components/Articulos';
import OrdenesDeCompra from './components/ordenesdecompra';

import './App.css';


const App = () => {
  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <Routes>
          <Route path="/Inicio" element={<Inicio />} />
          <Route path="/Proveedores" element={<Proveedores />} />
          <Route path="/articulos" element={<Articulos />} />
          <Route path="/ordenes-de-compra" element={<OrdenesDeCompra/>} />

          {/* ... otras rutas */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
