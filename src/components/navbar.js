import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTruck, faBoxOpen, faClipboardList, faUserTie, faUsers, faWarehouse, faCogs, faFileAlt, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import '../css/navbar.css';  // Asegúrate de que la ruta es correcta
import logo from '../css/logopracticloset.png';

const NavBar = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const navItems = [
        { to: "/", text: "Inicio", icon: faHome },
        { to: "/proveedores", text: "Gestion Proveedores", icon: faTruck },
        { to: "/articulos", text: "Gestion Artículos", icon: faBoxOpen },
        { to: "/ordenes-de-compra", text: "Órdenes de Compra", icon: faClipboardList },
        { to: "/trabajadores", text: "Gestion Trabajadores", icon: faUserTie },
        { to: "/Clientes", text: "Gestion Clientes", icon: faUsers },
        { to: "/Stock", text: "Gestionar Stock", icon: faWarehouse },
        { to: "/Modelos", text: "Gestionar Modelos", icon: faCogs },
        { to: "/Pedidos", text: "Gestionar Pedidos", icon: faShoppingCart },
        { to: "/Informes", text: "Gestionar Informes", icon: faFileAlt },
    ];

    const filteredNavItems = navItems.filter(item => item.text.toLowerCase().includes(searchTerm.toLowerCase()));

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
                    {filteredNavItems.map(item => (
                        <li key={item.to}>
                            <Link to={item.to}>
                                <FontAwesomeIcon icon={item.icon} /> {item.text}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default NavBar;
