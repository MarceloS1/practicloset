// src/components/GestionClientes.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCog } from '@fortawesome/free-solid-svg-icons';


const baseUrl = 'http://25.41.163.224:5000'; // Asegúrate de reemplazar esta URL con la dirección correcta de tu servidor

// Funciones para interactuar con el backend usando Axios
const api = {
  agregarCliente: async (cliente) => {
    const response = await axios.post(`${baseUrl}/clientes`, cliente);
    return response.data;
  },
  obtenerClientes: async () => {
    const response = await axios.get(`${baseUrl}/clientes`);
    return response.data.data; // Ajustar para obtener los datos correctamente
  },
  actualizarCliente: async (clienteId, cambios) => {
    const response = await axios.put(`${baseUrl}/clientes/${clienteId}`, cambios);
    return response.data;
  },
  eliminarCliente: async (clienteId) => {
    const response = await axios.delete(`${baseUrl}/clientes/${clienteId}`);
    return response.status === 204; // Ajustar para verificar el estado correcto
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
    try {
      const clientesData = await api.obtenerClientes();
      setClientes(clientesData);
      setClienteActual(null);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
    } catch (error) {
      console.error('Error al guardar el cliente:', error);
    }
  };

  const handleEliminar = async (clienteId) => {
    try {
      await api.eliminarCliente(clienteId);
      cargarClientes();
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
    }
  };

  const seleccionarCliente = (cliente) => {
    setClienteActual(cliente.cliente_id);
    setFormData({ ...cliente });
  };

  return (
    <div className="form-container" style={{ marginLeft: '10% ', marginRight: '0%' }}>
      <h2>Gestión de Clientes</h2>
      <form onSubmit={handleSubmit} style={{ margin: '20px 0' }} >
        <div>
          <label htmlFor="nombre">Nombre:</label>
          <input
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            required
          />
        </div>
        <div >
          <label htmlFor="apellido">Apellido:</label>
          <input
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            placeholder="Apellido"
            required
          />
        </div>
        <div >
          <label htmlFor="cedula">Cédula:</label>
          <input
            id="cedula"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            placeholder="Cédula"
            required
          />
        </div>
        <div >
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <div >
          <label htmlFor="telefono">Teléfono:</label>
          <input
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
            required
          />
        </div>
        <div >
          <label htmlFor="direccion">Dirección:</label>
          <input
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Dirección"
            required
          />
        </div>
        <div >
          <button type="submit" className="btn btn-primary">
            Guardar Cliente
          </button>
        </div>
      </form>
      <h3>Lista de Clientes</h3>
      <table className="articulos-lista">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Cédula</th>
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
              <td>{cliente.telefono}</td>
              <td>{cliente.direccion}</td>
              <td>
                <button
                  className="action-button modify-button"
                  onClick={() => seleccionarCliente(cliente)}>
                  <FontAwesomeIcon icon={faCog} />
                </button>
                <button
                  className="action-button delete-button"
                  onClick={() => handleEliminar(cliente.cliente_id)}>                 
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GestionClientes;
