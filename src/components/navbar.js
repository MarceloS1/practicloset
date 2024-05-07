import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/navbar.css';  // Asegúrate de que la ruta es correcta
import logo from '../css/logopracticloset.png'

const NavBar = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="navbar-container">
            <img src={logo} alt="Logo de PractiCloset" style={{ maxWidth: '200px', margin: '10px auto' }} />
            <div className="navbar-search">
                <input
                    type="text"
                    placeholder="Buscar módulo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="navbar-input"
                />
            </div>
            <nav>
                <ul className="navbar-nav">
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/proveedores">Proveedores</Link></li>
                    <li><Link to="/articulos">Artículos</Link></li>
                    <li><Link to="/ordenes-de-compra">Órdenes de Compra</Link></li>
                    <li><Link to="/trabajadores">trabajadores</Link></li>
                    <li><Link to="/Clientes">Gestion Clientes</Link></li>
                    <li><Link to="/Stock">Gestionar Stock</Link></li>
                    <li><Link to="/Modelos">Gestionar Modelos</Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default NavBar;
