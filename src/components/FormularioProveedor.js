import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/FormularioProveedor.css';

const FormularioProveedor = ({ onSubmit, proveedorActual, onReset }) => {
  // Estados para cada campo del formulario
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [tiempoEntregaEstimado, setTiempoEntregaEstimado] = useState('');
  const [direccion, setDireccion] = useState('');
  const [comentario, setComentario] = useState('');

  // Nuevo estado para almacenar la lista de proveedores
  const [listaProveedores, setListaProveedores] = useState([]);

  const cargarProveedores = async () => {
    try {
      const respuesta = await axios.get('http://25.5.98.175:5000/proveedores');
      setListaProveedores(respuesta.data);
    } catch (error) {
      console.error('Error al obtener los proveedores: ', error);
    }
  };
  useEffect(() => {
    cargarProveedores();
  }, []);


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
    
  },[proveedorActual]);

  const handleEliminarProveedor = async (proveedorId) => {
    try {
      const response = await axios.delete(`http://25.5.98.175:5000/proveedores/${proveedorId}`);
      if (response.status === 204) {
        console.log('Proveedor eliminado exitosamente');
        // Elimina el proveedor de la lista en el estado
        setListaProveedores(listaProveedores.filter((proveedor) => proveedor.proveedor_id !== proveedorId));
      }
    } catch (error) {
      console.error('Error al eliminar el proveedor:', error);
    }
  };

  // Función asíncrona para manejar el envío del formulario
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
        // Corregir la URL agregando la barra antes del ID
        response = await axios.put(`http://25.5.98.175:5000/proveedores/${proveedorActual.id}`, proveedorData);
      } else {
        response = await axios.post('http://25.5.98.175:5000/proveedores', proveedorData);
        setListaProveedores([...listaProveedores, response.data]);
      }
      setNombre('');
      setTelefono('');
      setEmail('');
      setTiempoEntregaEstimado('');
      setDireccion('');
      setComentario('');
      // Resetea los campos del formulario aquí
      handleReset();
      // Recarga la lista de proveedores solo después de que se haya completado la operación de POST o PUT
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
    <div className="form-container"style={{ marginLeft: '20%' }}> {/* Ajuste de estilo */} 
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
        <ul>
          {listaProveedores.map((proveedor) => (
            <li key={proveedor.proveedor_id || proveedor.id}>
              {`${proveedor.nombre} - ${proveedor.telefono} - ${proveedor.email}`}
              {/* Botón para eliminar el proveedor específico */}
              <button onClick={() => handleEliminarProveedor(proveedor.proveedor_id || proveedor.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FormularioProveedor;
