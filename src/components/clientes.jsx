// src/components/GestionClientes.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/FormularioProveedor.css';

const baseUrl = 'http://25.5.98.175:5000'; // Asegúrate de reemplazar esta URL con la dirección correcta de tu servidor

// Funciones para interactuar con el backend usando Axios
const api = {
  agregarCliente: async (cliente) => {
    const response = await axios.post(`${baseUrl}/clientes`, cliente);
    return response.data;
  },
  obtenerClientes: async () => {
    const response = await axios.get(`${baseUrl}/clientes`);
    return response.data;
  },
  actualizarCliente: async (clienteId, cambios) => {
    const response = await axios.put(`${baseUrl}/clientes/${clienteId}`, cambios);
    return response.data;
  },
  eliminarCliente: async (clienteId) => {
    const response = await axios.delete(`${baseUrl}/clientes/${clienteId}`);
    return response.status === 200;
  },
};

const GestionClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteActual, setClienteActual] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    email: '',
    telefono: '',
    direccion: '',
  });

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    const clientesData = await api.obtenerClientes();
    setClientes(clientesData);
    setClienteActual(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (clienteActual) {
      await api.actualizarCliente(clienteActual, formData);
    } else {
      await api.agregarCliente(formData);
    }
    cargarClientes();
    setFormData({
      nombre: '',
      apellido: '',
      cedula: '',
      email: '',
      telefono: '',
      direccion: '',
    });
  };

  const handleEliminar = async (clienteId) => {
    await api.eliminarCliente(clienteId);
    cargarClientes();
  };

  const seleccionarCliente = (cliente) => {
    setClienteActual(cliente.cliente_id);
    setFormData({ ...cliente });
  };

  return (
    <div className="gestion-clientes-container">
      <h2>Gestión de Clientes</h2>
      <form onSubmit={handleSubmit} className="cliente-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" />
        </div>
        <div className="form-group">
          <label htmlFor="apellido">Apellido:</label>
          <input id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" />
        </div>
        <div className="form-group">
          <label htmlFor="cedula">Cédula:</label>
          <input id="cedula" name="cedula" value={formData.cedula} onChange={handleChange} placeholder="Cédula" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        </div>
        <div className="form-group">
          <label htmlFor="telefono">Teléfono:</label>
          <input id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Teléfono" />
        </div>
        <div className="form-group">
          <label htmlFor="direccion">Dirección:</label>
          <input id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Dirección" />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Guardar Cliente</button>
        </div>
      </form>
      <h3>Lista de Clientes</h3>
      <table className="tabla-clientes">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Cédula</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.cliente_id}>
              <td>{cliente.nombre}</td>
              <td>{cliente.apellido}</td>
              <td>{cliente.cedula}</td>
              <td>{cliente.email}</td>
              <td>{cliente.telefono}</td>
              <td>{cliente.direccion}</td>
              <td>
                <button onClick={() => seleccionarCliente(cliente)} className="btn btn-editar">✏️</button>
                <button onClick={() => handleEliminar(cliente.cliente_id)} className="btn btn-eliminar">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GestionClientes;
