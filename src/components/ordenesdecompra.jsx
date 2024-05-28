import React, { useState, useEffect } from 'react';
import axios from 'axios';

const baseUrl = 'http://25.41.163.224:5000';

const OrdenesCompra = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [articulosFiltrados, setArticulosFiltrados] = useState([]);
  const [formulario, setFormulario] = useState({
    proveedor_id: '',
    fecha: '',
    estado: 'En proceso',
    detalles: []
  });
  const [ordenActual, setOrdenActual] = useState(null);

  useEffect(() => {
    cargarOrdenes();
    cargarProveedores();
    cargarArticulos();
  }, []);

  const cargarOrdenes = async () => {
    try {
      const respuesta = await axios.get(`${baseUrl}/ordenes`);
      setOrdenes(respuesta.data.data);
    } catch (error) {
      console.error('Error al obtener las órdenes:', error);
    }
  };

  const cargarProveedores = async () => {
    try {
      const respuesta = await axios.get(`${baseUrl}/proveedores`);
      setProveedores(respuesta.data.data);
    } catch (error) {
      console.error('Error al obtener los proveedores:', error);
    }
  };

  const cargarArticulos = async () => {
    try {
      const respuesta = await axios.get(`${baseUrl}/articulos`);
      setArticulos(respuesta.data.data);
    } catch (error) {
      console.error('Error al obtener los artículos:', error);
    }
  };

  const filtrarArticulosPorProveedor = (proveedorId) => {
    const articulosFiltrados = articulos.filter(articulo => articulo.proveedor_id === proveedorId);
    setArticulosFiltrados(articulosFiltrados);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });

    if (name === 'proveedor_id') {
      filtrarArticulosPorProveedor(Number(value));
    }
  };

  const handleDetalleChange = (index, e) => {
    const { name, value } = e.target;
    const detalles = [...formulario.detalles];
    detalles[index][name] = value;
    setFormulario({ ...formulario, detalles });
  };

  const agregarDetalle = () => {
    setFormulario({
      ...formulario,
      detalles: [...formulario.detalles, { articulo_id: '', cantidad: '' }]
    });
  };

  const eliminarDetalle = (index) => {
    const detalles = [...formulario.detalles];
    detalles.splice(index, 1);
    setFormulario({ ...formulario, detalles });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (ordenActual) {
        await axios.put(`${baseUrl}/ordenes/${ordenActual.orden_id}`, formulario);
      } else {
        await axios.post(`${baseUrl}/ordenes`, formulario);
      }
      cargarOrdenes();
      resetFormulario();
    } catch (error) {
      console.error('Error al guardar la orden:', error);
    }
  };

  const handleEliminar = async (ordenId) => {
    try {
      await axios.delete(`${baseUrl}/ordenes/${ordenId}`);
      cargarOrdenes();
    } catch (error) {
      console.error('Error al eliminar la orden:', error);
    }
  };

  const handleModificar = (orden) => {
    setOrdenActual(orden);
    setFormulario({
      proveedor_id: orden.proveedor_id,
      fecha: orden.fecha.split('T')[0],
      estado: orden.estado,
      detalles: orden.DetalleOrdens.map(detalle => ({
        articulo_id: detalle.articulo_id,
        cantidad: detalle.cantidad
      }))
    });
    filtrarArticulosPorProveedor(orden.proveedor_id);
  };

  const confirmarRecepcion = async (ordenId) => {
    try {
      await axios.post(`${baseUrl}/ordenes/${ordenId}/confirmarRecepcion`);
      cargarOrdenes();
    } catch (error) {
      console.error('Error al confirmar la recepción de la orden:', error);
    }
  };

  const resetFormulario = () => {
    setFormulario({
      proveedor_id: '',
      fecha: '',
      estado: 'En proceso',
      detalles: []
    });
    setOrdenActual(null);
    setArticulosFiltrados([]);
  };

  return (
    <div className="form-container" style={{ marginLeft: '20%' }}>
      <h2>Gestión de Órdenes de Compra</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Proveedor:</label>
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
        </div>
        <div>
          <label>Fecha:</label>
          <input
            type="date"
            name="fecha"
            value={formulario.fecha}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Estado:</label>
          <select
            name="estado"
            value={formulario.estado}
            onChange={handleChange}
            required
          >
            <option value="En proceso">En Proceso</option>
            <option value="Completado">Completado</option>
            <option value="Recibida">Recibida</option>
          </select>
        </div>
        <h4>Detalles</h4>
        {formulario.detalles.map((detalle, index) => (
          <div key={index}>
            <label>Artículo:</label>
            <select
              name="articulo_id"
              value={detalle.articulo_id}
              onChange={(e) => handleDetalleChange(index, e)}
              required
            >
              <option value="">Seleccione un artículo</option>
              {articulosFiltrados.map((articulo) => (
                <option key={articulo.articulo_id} value={articulo.articulo_id}>
                  {articulo.nombre}
                </option>
              ))}
            </select>
            <label>Cantidad:</label>
            <input
              type="number"
              name="cantidad"
              value={detalle.cantidad}
              onChange={(e) => handleDetalleChange(index, e)}
              required
            />
            <button type="button" onClick={() => eliminarDetalle(index)}>Eliminar</button>
          </div>
        ))}
        <button type="button" onClick={agregarDetalle}>Agregar Artículo</button>
        <button type="submit">{ordenActual ? 'Guardar Cambios' : 'Crear Orden'}</button>
        {ordenActual && <button type="button" onClick={resetFormulario}>Cancelar</button>}
      </form>
      <h3>Lista de Órdenes</h3>
      <table>
        <thead>
          <tr>
            <th>Proveedor</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Detalles</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((orden) => (
            <tr key={orden.orden_id}>
              <td>{proveedores.find(p => p.proveedor_id === orden.proveedor_id)?.nombre}</td>
              <td>{orden.fecha.split('T')[0]}</td>
              <td>{orden.estado}</td>
              <td>
                {orden.DetalleOrdens.map((detalle, index) => (
                  <div key={index}>
                    {detalle.Articulo.nombre} - {detalle.cantidad}
                  </div>
                ))}
              </td>
              <td>
                <button onClick={() => handleModificar(orden)}>Editar</button>
                <button onClick={() => handleEliminar(orden.orden_id)}>Eliminar</button>
                {orden.estado === 'En proceso' && (
                  <button onClick={() => confirmarRecepcion(orden.orden_id)}>Confirmar Recepción</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdenesCompra;
