import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCog } from '@fortawesome/free-solid-svg-icons';
import '../css/FormularioProveedor.css';

const baseUrl = 'http://25.5.98.175:5000';

const Articulo = () => {
  const [formulario, setFormulario] = useState({
    nombre: '',
    precio: '',
    tipo: '',
    proveedor_id: '',
  });
  const [articulos, setArticulos] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resProveedores = await axios.get(`${baseUrl}/proveedores`);
        setProveedores(resProveedores.data);

        const resArticulos = await axios.get(`${baseUrl}/articulos`);
        setArticulos(resArticulos.data);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formulario.articulo_id) {
        // Si hay un artículo seleccionado para editar, enviar una solicitud de actualización
        const response = await axios.put(`${baseUrl}/articulos/${formulario.articulo_id}`, formulario);
        console.log('Artículo actualizado:', response.data);
        // Actualizar la lista de artículos
        setArticulos(articulos.map((articulo) => (articulo.articulo_id === formulario.articulo_id ? response.data : articulo)));
      } else {
        // Si no hay ningún artículo seleccionado, enviar una solicitud de creación
        const response = await axios.post(`${baseUrl}/articulos`, formulario);
        console.log('Artículo creado:', response.data);
        // Actualizar la lista de artículos
        setArticulos([...articulos, response.data]);
      }
      // Limpiar formulario
      setFormulario({
        nombre: '',
        precio: '',
        tipo: '',
        proveedor_id: '',
      });
    } catch (error) {
      console.error('Error al guardar el artículo:', error);
    }
  };
  

  const handleEliminar = async (articuloId) => {
    // Aquí pondrías la lógica para manejar la eliminación.
    try {
      await axios.delete(`${baseUrl}/articulos/${articuloId}`);
      // Actualizar la lista de artículos
      setArticulos(articulos.filter((articulo) => articulo.articulo_id !== articuloId));
    } catch (error) {
      console.error('Error al eliminar el artículo:', error);
    }
  };

  const handleModificar = (articuloId) => {
    // Aquí puedes implementar la lógica para seleccionar un artículo y cargar sus datos en el formulario para modificar.
    const articuloSeleccionado = articulos.find((articulo) => articulo.articulo_id === articuloId);
    if (articuloSeleccionado) {
      setFormulario(articuloSeleccionado);
    }
  };

  const obtenerNombreProveedor = (proveedorId) => {
    const proveedor = proveedores.find((p) => p.proveedor_id === proveedorId);
    return proveedor ? proveedor.nombre : '';
  };

  return (
    <div>
      <h2>Registrar Artículo</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="nombre"
          value={formulario.nombre}
          onChange={handleChange}
          placeholder="Nombre del artículo"
          required
        />
        <input
          type="number"
          name="precio"
          value={formulario.precio}
          onChange={handleChange}
          placeholder="Precio del artículo"
          required
        />
        <input
          name="tipo"
          value={formulario.tipo}
          onChange={handleChange}
          placeholder="Tipo de artículo"
          required
        />
        <select
          name="proveedor_id"
          value={formulario.proveedor_id}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un proveedor</option>
          {proveedores.map((proveedor) => (
            <option key={proveedor.proveedor_id} value={proveedor.proveedor_id}>
              {proveedor.nombre}
            </option>
          ))}
        </select>
        <button type="submit">Guardar</button>
      </form>
      <div className="articulos-lista">
        <h3>Lista de Artículos</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Tipo</th>
              <th>Proveedor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {articulos.map((articulo) => (
              <tr key={articulo.articulo_id}>
                <td>{articulo.nombre}</td>
                <td>{articulo.precio}</td>
                <td>{articulo.tipo}</td>
                <td>{obtenerNombreProveedor(articulo.proveedor_id)}</td>
                <td>
                  {/* Botones de acciones */}
                  <button className="action-button modify-button" onClick={() => handleModificar(articulo.articulo_id)}>
                    <FontAwesomeIcon icon={faCog} />
                  </button>
                  <button className="action-button delete-button" onClick={() => handleEliminar(articulo.articulo_id)}>
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

export default Articulo;