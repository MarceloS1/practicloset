import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCog } from '@fortawesome/free-solid-svg-icons';
import '../css/FormularioProveedor.css';

const baseUrl = 'http://25.5.98.175:5000';

const FormularioProveedor = ({ onSubmit, onReset }) => {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [tiempoEntregaEstimado, setTiempoEntregaEstimado] = useState('');
  const [direccion, setDireccion] = useState('');
  const [comentario, setComentario] = useState('');
  const [proveedorActual, setProveedorActual] = useState(null);
  const [listaProveedores, setListaProveedores] = useState([]);

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      const respuesta = await axios.get(`${baseUrl}/proveedores`);
      if (respuesta.data && respuesta.data.data) {
        setListaProveedores(respuesta.data.data);
      } else {
        console.error('Estructura de respuesta inesperada:', respuesta.data);
      }
    } catch (error) {
      console.error('Error al obtener los proveedores:', error);
    }
  };

  useEffect(() => {
    if (proveedorActual) {
      setNombre(proveedorActual.nombre);
      setTelefono(proveedorActual.telefono);
      setEmail(proveedorActual.email);
      setTiempoEntregaEstimado(proveedorActual.tiempo_entrega_estimado);
      setDireccion(proveedorActual.direccion);
      setComentario(proveedorActual.comentario);
    }
  }, [proveedorActual]);

  const handleEliminarProveedor = async (proveedorId) => {
    try {
      const response = await axios.delete(`${baseUrl}/proveedores/${proveedorId}`);
      if (response.status === 204) {
        console.log('Proveedor eliminado exitosamente');
        setListaProveedores(listaProveedores.filter((proveedor) => proveedor.proveedor_id !== proveedorId));
      }
    } catch (error) {
      console.error('Error al eliminar el proveedor:', error);
    }
  };

  const handleModificarProveedor = (proveedorId) => {
    const proveedorSeleccionado = listaProveedores.find((proveedor) => proveedor.proveedor_id === proveedorId);
    if (proveedorSeleccionado) {
      setNombre(proveedorSeleccionado.nombre);
      setTelefono(proveedorSeleccionado.telefono);
      setEmail(proveedorSeleccionado.email);
      setTiempoEntregaEstimado(proveedorSeleccionado.tiempo_entrega_estimado);
      setDireccion(proveedorSeleccionado.direccion);
      setComentario(proveedorSeleccionado.comentario);
      setProveedorActual(proveedorSeleccionado);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const proveedorData = {
      nombre,
      telefono,
      email,
      tiempo_entrega_estimado: tiempoEntregaEstimado,
      direccion,
      comentario,
    };

    try {
      let response;
      if (proveedorActual) {
        response = await axios.put(`${baseUrl}/proveedores/${proveedorActual.proveedor_id}`, proveedorData);
        setListaProveedores(listaProveedores.map((proveedor) => {
          if (proveedor.proveedor_id === proveedorActual.proveedor_id) {
            return response.data.data;
          }
          return proveedor;
        }));
      } else {
        response = await axios.post(`${baseUrl}/proveedores`, proveedorData);
        setListaProveedores([...listaProveedores, response.data.data]);
      }
      setProveedorActual(null);
      handleReset();
      await cargarProveedores();
    } catch (error) {
      console.error('Error al procesar la solicitud', error);
    }
  };

  const handleReset = () => {
    setNombre('');
    setTelefono('');
    setEmail('');
    setTiempoEntregaEstimado('');
    setDireccion('');
    setComentario('');
    onReset();
  };

  return (    
    <div className="form-container" style={{ marginLeft: '10% ', marginRight: '0%' }}>
      <h2>Proveedores</h2>
      <form onSubmit={handleFormSubmit} className="provider-form">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          required
        />
        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Teléfono"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="number"
          value={tiempoEntregaEstimado}
          onChange={(e) => setTiempoEntregaEstimado(e.target.value)}
          placeholder="Tiempo Entrega Estimado"
          required
        />
        <input
          type="text"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Dirección"
          required
        />
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Comentario"
          required
        />
        <button type="submit">Guardar</button>
        <button type="button" onClick={handleReset}>Cancelar</button>
      </form>
      <div className="proveedores-lista">
        <h3>Lista de Proveedores</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {listaProveedores.map((proveedor) => (
              <tr key={proveedor.proveedor_id}>
                <td>{proveedor.nombre}</td>
                <td>{proveedor.telefono}</td>
                <td>{proveedor.email}</td>
                <td>
                  <button
                    className="action-button modify-button"
                    onClick={() => handleModificarProveedor(proveedor.proveedor_id)}
                  >
                    <FontAwesomeIcon icon={faCog} />
                  </button>
                  <button
                    className="action-button delete-button"
                    onClick={() => handleEliminarProveedor(proveedor.proveedor_id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FormularioProveedor;
