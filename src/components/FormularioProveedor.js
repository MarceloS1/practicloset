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

  // Efecto para cargar los proveedores cuando el componente se monta
  useEffect(() => {
    const cargarProveedores = async () => {
      try {
        const respuesta = await axios.get('http://25.5.98.175:5000/proveedores');
        setListaProveedores(respuesta.data);
      } catch (error) {
        console.error('Error al obtener los proveedores: ', error);
      }
    };

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
        // URL del endpoint de actualización
        response = await axios.put(`/api/proveedores/${proveedorActual.id}`, proveedorData);
      } else {
        // URL del endpoint de creación
        response = await axios.post('/api/proveedores', proveedorData);
      }

      console.log(response.data); // Respuesta del servidor
      onReset(); // Limpia el formulario
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
    <div className="form-container">
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
        {listaProveedores.length > 0 ? (
          <ul>
            {listaProveedores.map((proveedor) => (
              <li key={proveedor.id}>
                {proveedor.nombre} - {proveedor.telefono} - {proveedor.email}
                {/* Añade aquí más detalles si es necesario */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay proveedores para mostrar.</p>
        )}
      </div>
    </div>
    

  );
  
  
};

export default FormularioProveedor;
