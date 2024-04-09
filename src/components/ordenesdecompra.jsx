import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrdenesDeCompra = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [ordenData, setOrdenData] = useState({
    orden_id: '',
    fecha: '',
    proveedor_id: '',
    estado: 'Pendiente'
  });

  useEffect(() => {
    const fetchInicialData = async () => {
      try {
        const resOrdenes = await axios.get('http://25.5.98.175:5000/ordenes');
        const resProveedores = await axios.get('http://25.5.98.175:5000/proveedores');
        setOrdenes(resOrdenes.data);
        setProveedores(resProveedores.data);
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
      if (ordenData.orden_id) {
        const response = await axios.put(`http://25.5.98.175:5000/ordenes/${ordenData.orden_id}`, ordenData);
        console.log('Orden actualizada:', response.data);
        setOrdenes(ordenes.map((orden) => (orden.orden_id === ordenData.orden_id ? response.data : orden)));
      } else {
        const response = await axios.post('http://25.5.98.175:5000/ordenes', ordenData);
        console.log('Orden creada:', response.data);
        setOrdenes([...ordenes, response.data]);
      }
      setOrdenData({
        orden_id: '',
        fecha: '',
        proveedor_id: '',
        estado: 'Pendiente'
      });
    } catch (error) {
      console.error('Error al guardar la orden:', error);
    }
  };

  const handleModificar = (orden) => {
    setOrdenData({
      orden_id: orden.orden_id,
      fecha: orden.fecha,
      proveedor_id: orden.proveedor_id,
      estado: orden.estado
    });
  };

  const handleEliminar = async (ordenId) => {
    try {
      await axios.delete(`http://25.5.98.175:5000/ordenes/${ordenId}`);
      setOrdenes(ordenes.filter((orden) => orden.orden_id !== ordenId));
    } catch (error) {
      console.error('Error al eliminar la orden:', error);
    }
  };

  return (
    <div>
      <h2>Crear/Editar Orden de Compra</h2>
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
        <select name="estado" value={ordenData.estado} onChange={handleInputChange} required>
        <option value="">Seleccione un estado</option>
        <option value="Pendiente">Pendiente</option>
        <option value="En proceso">En proceso</option>
        <option value="Completado">Completado</option>
        </select>

        <button type="submit">Guardar Orden</button>
      </form>
      <h2>Lista de Órdenes</h2>
      <table>
        <thead>
          <tr>
            
            <th>Fecha</th>
            <th>Proveedor</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map(orden => (
            <tr key={orden.orden_id}>
              
              <td>{new Date(orden.fecha).toLocaleDateString()}</td>
              <td>
                {proveedores.find(proveedor => proveedor.proveedor_id === orden.proveedor_id)?.nombre || 'Proveedor no encontrado'}
              </td>
              <td>{orden.estado}</td>
              <td>
                <button onClick={() => handleModificar(orden)}>Modificar</button>
                <button onClick={() => handleEliminar(orden.orden_id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdenesDeCompra;
