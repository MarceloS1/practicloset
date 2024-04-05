import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div style={{ width: '20%', background: '#f0f0f0' }}>
      <input
        type="text"
        placeholder="Buscar módulo..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/proveedores">Proveedores</Link></li>
          <li><Link to="/articulos">Artículos</Link></li>
          <li>  <Link to="/ordenes-de-compra">Órdenes de Compra</Link></li>
          {/* ... más enlaces si son necesarios */}
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
