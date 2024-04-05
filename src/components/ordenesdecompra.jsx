import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrdenesDeCompra = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [ordenData, setOrdenData] = useState({
    fecha: '',
    proveedor_id: '',
    estado: 'Pendiente' // Estado inicial de la orden
  });

  useEffect(() => {
    const fetchInicialData = async () => {
      try {
        const resOrdenes = await axios.get('http://25.5.98.175:5000/ordenes');
        const resProveedores = await axios.get('http://25.5.98.175:5000/proveedores');
        const resArticulos = await axios.get('http://25.5.98.175:5000/articulos');
        setOrdenes(resOrdenes.data);
        setProveedores(resProveedores.data);
        setArticulos(resArticulos.data);
      } catch (error) {
        console.error('Error al obtener datos iniciales:', error);
      }
    };
    fetchInicialData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrdenData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://25.5.98.175:5000/ordenes', ordenData);
      // Limpia el formulario después de la creación
      setOrdenData({
        fecha: '',
        proveedor_id: '',
        estado: 'Pendiente'
      });
      // Refrescar la lista de órdenes
      const resOrdenes = await axios.get('http://25.5.98.175:5000/ordenes');
      setOrdenes(resOrdenes.data);
    } catch (error) {
      console.error('Error al crear la orden:', error);
    }
  };

  // Aquí puedes agregar las funciones para modificar y eliminar órdenes y detalles

  return (
    <div>
      <h2>Crear Orden de Compra</h2>
      <form onSubmit={handleSubmit}>
        <input type="date" name="fecha" value={ordenData.fecha} onChange={handleInputChange} required />
        <select name="proveedor_id" value={ordenData.proveedor_id} onChange={handleInputChange} required>
          <option value="">Seleccione un proveedor</option>
          {proveedores.map(proveedor => (
            <option key={proveedor.proveedor_id} value={proveedor.proveedor_id}>
              {proveedor.nombre}
            </option>
          ))}
        </select>
        <input type="text" name="estado" value={ordenData.estado} onChange={handleInputChange} required />
        <button type="submit">Crear Orden</button>
      </form>
      <h2>Lista de Órdenes</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Proveedor</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map(orden => (
            <tr key={orden.orden_id}>
              <td>{orden.orden_id}</td>
              <td>{orden.fecha}</td>
              <td>
                {proveedores.find(proveedor => proveedor.proveedor_id === orden.proveedor_id)?.nombre || 'Proveedor no encontrado'}
              </td>
              <td>{orden.estado}</td>
              <td>
                {/* Botones para modificar y eliminar */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Aquí puedes implementar la funcionalidad para añadir detalles a la orden y listarlos */}
    </div>
  );
};

export default OrdenesDeCompra;
