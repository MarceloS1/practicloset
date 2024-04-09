import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCog } from '@fortawesome/free-solid-svg-icons';
import '../css/FormularioProveedor.css';

const baseUrl = 'http://25.5.98.175:5000';

const FormularioProveedor = ({ onSubmit, onReset }) => {
  // Estados para cada campo del formulario
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [tiempoEntregaEstimado, setTiempoEntregaEstimado] = useState('');
  const [direccion, setDireccion] = useState('');
  const [comentario, setComentario] = useState('');
  const [proveedorActual, setProveedorActual] = useState(null); // Estado para almacenar el proveedor actual

  // Nuevo estado para almacenar la lista de proveedores
  const [listaProveedores, setListaProveedores] = useState([]);

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      const respuesta = await axios.get(`${baseUrl}/proveedores`);
      setListaProveedores(respuesta.data);
    } catch (error) {
      console.error('Error al obtener los proveedores: ', error);
    }
  };

  // Carga los datos del proveedor en el formulario para editar
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
        // Elimina el proveedor de la lista en el estado
        setListaProveedores(listaProveedores.filter((proveedor) => proveedor.proveedor_id !== proveedorId));
      }
    } catch (error) {
      console.error('Error al eliminar el proveedor:', error);
    }
  };

  const handleModificarProveedor = (proveedorId) => {
    // Aquí puedes implementar la lógica para seleccionar un proveedor y cargar sus datos en el formulario para modificar.
    const proveedorSeleccionado = listaProveedores.find((proveedor) => proveedor.proveedor_id === proveedorId);
    if (proveedorSeleccionado) {
      setNombre(proveedorSeleccionado.nombre);
      setTelefono(proveedorSeleccionado.telefono);
      setEmail(proveedorSeleccionado.email);
      setTiempoEntregaEstimado(proveedorSeleccionado.tiempo_entrega_estimado);
      setDireccion(proveedorSeleccionado.direccion);
      setComentario(proveedorSeleccionado.comentario);
      // Asegurarse de que proveedorActual esté actualizado
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
  
    // Utiliza la propiedad proveedorActual para determinar si se está creando o actualizando un proveedor
    try {
      let response;
      if (proveedorActual) {
        // Utilizar el ID del proveedor actual para la solicitud PUT
        response = await axios.put(`${baseUrl}/proveedores/${proveedorActual.proveedor_id}`, proveedorData);
        // Actualizar el estado listaProveedores con los datos actualizados
        setListaProveedores(listaProveedores.map((proveedor) => {
          if (proveedor.proveedor_id === proveedorActual.proveedor_id) {
            return response.data;
          }
          return proveedor;
        }));
      } else {
        response = await axios.post(`${baseUrl}/proveedores`, proveedorData);
        // Agregar el nuevo proveedor a listaProveedores
        setListaProveedores([...listaProveedores, response.data]);
      }
      // Restablecer el proveedorActual después de enviar el formulario
      setProveedorActual(null);
      // Limpiar los campos del formulario
      handleReset();
      // Recargar la lista de proveedores solo después de que se haya completado la operación de POST o PUT
      await cargarProveedores();
    } catch (error) {
      console.error('Error al procesar la solicitud', error);
    }
  };
  const handleReset = () => {
    // Limpia los estados del formulario
    setNombre('');
    setTelefono('');
    setEmail('');
    setTiempoEntregaEstimado('');
    setDireccion('');
    setComentario('');
    onReset(); // Limpia el estado del componente padre
  };

  return (
    <div className="form-container" style={{ marginLeft: '20%' }}>
      <h2>Proveedores</h2>
      <form onSubmit={handleFormSubmit} className="provider-form">
        {/* Los inputs para los campos del formulario */}
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
      {/* Lista de proveedores */}
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
                  {/* Botón de modificar */}
                  <button
                    className="action-button modify-button"
                    onClick={() => handleModificarProveedor(proveedor.proveedor_id)}
                  >
                    <FontAwesomeIcon icon={faCog} />
                  </button>
                  {/* Botón de eliminar */}
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
