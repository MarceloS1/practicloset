import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GestionStock = () => {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [cantidadDisponible, setCantidadDisponible] = useState('');
  const [cantidadReservada, setCantidadReservada] = useState('');
  const [productoId, setProductoId] = useState(null);

  // Función para cargar los productos
  const cargarProductos = async () => {
    try {
      const respuesta = await axios.get('http://25.5.98.175:5000/productos');
      setProductos(respuesta.data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // Función para agregar un nuevo producto
  const agregarProducto = async (e) => {
    e.preventDefault();
    const datosProducto = {
      nombre,
      descripcion,
      categoria_id: categoriaId,
      cantidad_disponible: cantidadDisponible,
      cantidad_reservada: cantidadReservada,
    };
    try {
      const respuesta = await axios.post('http://25.5.98.175:5000/productos', datosProducto);
      setProductos([...productos, respuesta.data]);
      // Restablece los campos del formulario
      setNombre('');
      setDescripcion('');
      setCategoriaId('');
      setCantidadDisponible('');
      setCantidadReservada('');
    } catch (error) {
      console.error('Error al agregar el producto:', error);
    }
  };

  // Función para editar un producto existente
  const editarProducto = async (e) => {
    e.preventDefault();
    const datosProducto = {
      nombre,
      descripcion,
      categoria_id: categoriaId,
      cantidad_disponible: cantidadDisponible,
      cantidad_reservada: cantidadReservada,
    };
    try {
      const respuesta = await axios.put(`http://25.5.98.175:5000/productos/${productoId}`, datosProducto);
      setProductos(productos.map((producto) =>
        producto.producto_id === productoId ? respuesta.data : producto
      ));
      // Restablece los campos del formulario
      setNombre('');
      setDescripcion('');
      setCategoriaId('');
      setCantidadDisponible('');
      setCantidadReservada('');
      setProductoId(null);
    } catch (error) {
      console.error('Error al editar el producto:', error);
    }
  };

  // Función para eliminar un producto
  const eliminarProducto = async (productoId) => {
    try {
      await axios.delete(`http://25.5.98.175:5000/productos/${productoId}`);
      setProductos(productos.filter((producto) => producto.producto_id !== productoId));
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  return (
    <div>
      <h2>Gestión de Stock</h2>
      
      <form onSubmit={productoId ? editarProducto : agregarProducto}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descripción:</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Categoría ID:</label>
          <input
            type="number"
            value={categoriaId}
            onChange={(e) => setCategoriaId(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Cantidad Disponible:</label>
          <input
            type="number"
            value={cantidadDisponible}
            onChange={(e) => setCantidadDisponible(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Cantidad Reservada:</label>
          <input
            type="number"
            value={cantidadReservada}
            onChange={(e) => setCantidadReservada(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit">{productoId ? 'Editar' : 'Agregar'} Producto</button>
        {productoId && (
          <button type="button" onClick={() => setProductoId(null)}>
            Cancelar
          </button>
        )}
      </form>
      
      <h3>Lista de Productos</h3>
      <ul>
        {productos.map((producto) => (
          <li key={producto.producto_id}>
            <span>{producto.nombre} - Descripción: {producto.descripcion}, Cantidad Disponible: {producto.cantidad_disponible}, Cantidad Reservada: {producto.cantidad_reservada}</span>
            <button onClick={() => {
              setNombre(producto.nombre);
              setDescripcion(producto.descripcion);
              setCategoriaId(producto.categoria_id);
              setCantidadDisponible(producto.cantidad_disponible);
              setCantidadReservada(producto.cantidad_reservada);
              setProductoId(producto.producto_id);
            }}>Editar</button>
            <button onClick={() => eliminarProducto(producto.producto_id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionStock;
