import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/dashboard.css'; // Asegúrate de tener estilos para el dashboard
import { FaUser, FaTruck, FaBox, FaUsers, FaWarehouse, FaCogs, FaClipboardList } from 'react-icons/fa';

const baseUrl = 'https://practicloset.onrender.com/api';

const Dashboard = () => {
  const [data, setData] = useState({
    clientes: 0,
    proveedores: 0,
    articulos: 0,
    trabajadores: 0,
    stock: 0,
    modelos: 0,
    pedidos: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientes, proveedores, articulos, trabajadores, stock, modelos, pedidos] = await Promise.all([
          axios.get(`${baseUrl}/clientes/count`),
          axios.get(`${baseUrl}/proveedores/count`),
          axios.get(`${baseUrl}/articulos/count`),
          axios.get(`${baseUrl}/trabajadores/count`),
          axios.get(`${baseUrl}/stock/count`),
          axios.get(`${baseUrl}/modelos/count`),
          axios.get(`${baseUrl}/pedidos/count`),
        ]);

        setData({
          clientes: clientes.data.count,
          proveedores: proveedores.data.count,
          articulos: articulos.data.count,
          trabajadores: trabajadores.data.count,
          stock: stock.data.count,
          modelos: modelos.data.count,
          pedidos: pedidos.data.count,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <FaUser className="dashboard-icon" />
        <h3>Clientes</h3>
        <p>{data.clientes}</p>
      </div>
      <div className="dashboard-card">
        <FaTruck className="dashboard-icon" />
        <h3>Proveedores</h3>
        <p>{data.proveedores}</p>
      </div>
      <div className="dashboard-card">
        <FaBox className="dashboard-icon" />
        <h3>Artículos</h3>
        <p>{data.articulos}</p>
      </div>
      <div className="dashboard-card">
        <FaUsers className="dashboard-icon" />
        <h3>Trabajadores</h3>
        <p>{data.trabajadores}</p>
      </div>
     
      <div className="dashboard-card">
        <FaCogs className="dashboard-icon" />
        <h3>Modelos</h3>
        <p>{data.modelos}</p>
      </div>
      <div className="dashboard-card">
        <FaClipboardList className="dashboard-icon" />
        <h3>Pedidos</h3>
        <p>{data.pedidos}</p>
      </div>
    </div>
  );
};

export default Dashboard;
