import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/FormularioProveedor.css';

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
        const resProveedores = await axios.get('http://25.5.98.175:5000/proveedores');
        setProveedores(resProveedores.data);

        const resArticulos = await axios.get('http://25.5.98.175:5000/articulos');
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
      const response = await axios.post('http://25.5.98.175:5000/articulos', formulario);
      console.log('Artículo creado:', response.data);
      // Actualizar la lista de artículos
      setArticulos([...articulos, response.data]);
      // Limpiar formulario
      setFormulario({
        nombre: '',
        precio: '',
        tipo: '',
        proveedor_id: '',
      });
    } catch (error) {
      console.error('Error creando el artículo:', error);
    }
  };
  const handleEliminar = async (articuloId) => {
    // Aquí pondrías la lógica para manejar la eliminación.
    try {
      await axios.delete(`http://25.5.98.175:5000/articulos/${articuloId}`);
      // Actualizar la lista de artículos
      setArticulos(articulos.filter((articulo) => articulo.articulo_id !== articuloId));
    } catch (error) {
      console.error('Error al eliminar el artículo:', error);
    }
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
      <h2>Lista de Artículos</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Tipo</th>
            <th>Proveedor</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map((articulo) => (
            <tr key={articulo.articulo_id}>
              <td>{articulo.nombre}</td>
              <td>{articulo.precio}</td>
              <td>{articulo.tipo}</td>
              <td>
                {/* Botones de acciones */}
                <button onClick={() => handleModificar(articulo.articulo_id)}>Modificar</button>
                <button onClick={() => handleEliminar(articulo.articulo_id)}>Eliminar</button>
              </td>
           
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Articulo;
