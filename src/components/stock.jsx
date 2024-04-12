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
  const [categorias, setCategorias] = useState([]);


  // Función para cargar los productos
  const cargarProductos = async () => {
    try {
      const respuesta = await axios.get('http://25.5.98.175:5000/productos');
      setProductos(respuesta.data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };
  const cargarCategorias = async () => {
    try {
        const respuesta = await axios.get('http://25.5.98.175:5000/categorias');
        setCategorias(respuesta.data);
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
    }
};

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
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
      setProductoId(null);
    } catch (error) {
      console.error('Error al agregar el producto:', error);
    }
  };

  // Función para editar un producto existente
  const editarProducto = async (e) => {
    e.preventDefault();
    
    // Datos del producto que se van a editar
    const datosProducto = {
        nombre,
        descripcion,
        categoria_id: categoriaId,
        cantidad_disponible: cantidadDisponible,
        cantidad_reservada: cantidadReservada,
    };

    console.log('Enviando datos de edición:', datosProducto);

    try {
        // Realiza la solicitud PUT para editar el producto
        const respuesta = await axios.put(`http://25.5.98.175:5000/productos/${productoId}`, datosProducto);
        
        console.log('Respuesta del servidor:', respuesta);
        
        // Verifica si la respuesta fue exitosa y actualiza la lista de productos
        if (respuesta.status === 200) {
            const productoEditado = respuesta.data;
            setProductos(productos.map((producto) =>
                producto.producto_id === productoId ? productoEditado : producto
            ));
        } else {
            console.error('Error en la respuesta del servidor:', respuesta);
        }

        // Restablece el formulario después de la edición
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
            <label>Categoría:</label>
            <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(Number(e.target.value))}
                required
            >
                <option value="">Selecciona una categoría</option>
                {categorias.map((categoria) => (
                <option key={categoria.categoria_id} value={categoria.categoria_id}>
                    {categoria.nombre}
                </option>
                ))}
                </select>
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
      <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Cantidad Disponible</th>
          <th>Cantidad Reservada</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((producto) => (
          <tr key={producto.producto_id}>
            <td>{producto.nombre}</td>
            <td>{producto.descripcion}</td>
            <td>{producto.cantidad_disponible}</td>
            <td>{producto.cantidad_reservada}</td>
            <td>
              <button onClick={() => {
                setNombre(producto.nombre);
                setDescripcion(producto.descripcion);
                setCategoriaId(producto.categoria_id);
                setCantidadDisponible(producto.cantidad_disponible);
                setCantidadReservada(producto.cantidad_reservada);
                setProductoId(producto.producto_id);
              }}>Editar</button>
              <button onClick={() => eliminarProducto(producto.producto_id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default GestionStock;
