import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/navbar';
import Proveedores from './components/FormularioProveedor';
import Inicio from './components/Inicio';
import Articulos from './components/Articulos';
import OrdenesDeCompra from './components/ordenesdecompra';
import FormularioTrabajador from './components/trabajadores';
import GestionClientes from './components/clientes';
import GestionStock from './components/stock';
import '../src/css/base.css';
import './App.css';
import FormularioModelo from './components/modelos';
import OrdenesCompra from './components/ordenesdecompra';
import GestionPedidosYPagos from './components/gestionPagos';


const App = () => {
  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <Routes>
          <Route path="/Inicio" element={<Inicio />} />
          <Route path="/Proveedores" element={<Proveedores />} />
          <Route path="/articulos" element={<Articulos />} />
          <Route path="/ordenes-de-compra" element={<OrdenesCompra/>} />
          <Route path="/trabajadores" element={<FormularioTrabajador/>} />
          <Route path="/Clientes" element={<GestionClientes/>} />
          <Route path="/Stock" element={<GestionStock/>} />
          <Route path="/Modelos" element={<FormularioModelo/>} />
          <Route path="/Pedidos" element={<GestionPedidosYPagos/>} />

          {/* ... otras rutas */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
