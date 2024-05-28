import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCog } from '@fortawesome/free-solid-svg-icons';

const baseUrl = 'http://25.41.163.224:5000';

const FormularioModelo = ({ onSubmit, onReset }) => {
  const [nombre, setNombre] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [material, setMaterial] = useState('');
  const [alto, setAlto] = useState('');
  const [ancho, setAncho] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [cantidadDisponible, setCantidadDisponible] = useState('');
  const [cantidadReservada, setCantidadReservada] = useState('');
  const [modeloActual, setModeloActual] = useState(null);
  const [listaModelos, setListaModelos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    cargarModelos();
    cargarCategorias();
  }, []);

  const cargarModelos = async () => {
    try {
      const respuesta = await axios.get(`${baseUrl}/modelos`);
      setListaModelos(respuesta.data.data); // Ajuste para obtener los datos correctamente
    } catch (error) {
      console.error('Error al obtener los modelos: ', error);
    }
  };

  const cargarCategorias = async () => {
    try {
      const respuesta = await axios.get(`${baseUrl}/categorias`);
      setCategorias(respuesta.data.data);
    } catch (error) {
      console.error('Error al obtener las categorías: ', error);
    }
  };

  useEffect(() => {
    if (modeloActual) {
      setNombre(modeloActual.nombre);
      setCategoriaId(modeloActual.categoria_id);
      setDescripcion(modeloActual.descripcion);
      setMaterial(modeloActual.material);
      setAlto(modeloActual.alto);
      setAncho(modeloActual.ancho);
      setPrecio(modeloActual.precio);
      setImagenUrl(modeloActual.imagen_url);
      setCantidadDisponible(modeloActual.Stock.cantidad_disponible);
      setCantidadReservada(modeloActual.Stock.cantidad_reservada);
    }
  }, [modeloActual]);

  const handleEliminarModelo = async (modeloId) => {
    try {
      const response = await axios.delete(`${baseUrl}/modelos/${modeloId}`);
      if (response.status === 204) {
        console.log('Modelo eliminado exitosamente');
        setListaModelos(listaModelos.filter((modelo) => modelo.modelo_id !== modeloId));
      }
    } catch (error) {
      console.error('Error al eliminar el modelo:', error);
    }
  };

  const handleModificarModelo = (modeloId) => {
    const modeloSeleccionado = listaModelos.find((modelo) => modelo.modelo_id === modeloId);
    if (modeloSeleccionado) {
      setModeloActual(modeloSeleccionado);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const modeloData = {
      nombre,
      categoria_id: categoriaId,
      descripcion,
      material,
      alto,
      ancho,
      precio,
      imagen_url: imagenUrl,
      cantidad_disponible: cantidadDisponible,
      cantidad_reservada: cantidadReservada
    };

    try {
      let response;
      if (modeloActual) {
        response = await axios.put(`${baseUrl}/modelos/${modeloActual.modelo_id}`, modeloData);
        setListaModelos(listaModelos.map((modelo) => modelo.modelo_id === modeloActual.modelo_id ? response.data.data : modelo));
      } else {
        response = await axios.post(`${baseUrl}/modelos`, modeloData);
        setListaModelos([...listaModelos, response.data.data]);
      }
      setModeloActual(null);
      handleReset();
    } catch (error) {
      console.error('Error al procesar la solicitud', error);
    }
  };

  const handleReset = () => {
    setNombre('');
    setCategoriaId('');
    setDescripcion('');
    setMaterial('');
    setAlto('');
    setAncho('');
    setPrecio('');
    setImagenUrl('');
    setCantidadDisponible('');
    setCantidadReservada('');
    onReset();
  };

  return (
    <div className="form-container" style={{ marginLeft: '20%' }}>
      <h2>Modelos</h2>
      <form onSubmit={handleFormSubmit} className="model-form">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          required
        />
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          required
        >
          <option value="">Selecciona una categoría</option>
          {categorias
            .filter(categoria => categoria.categoria_id === 1 || categoria.categoria_id === 3)
            .map((categoria) => (
              <option key={categoria.categoria_id} value={categoria.categoria_id}>
                {categoria.nombre}
              </option>
            ))}
        </select>
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción"
          required
        />
        <input
          type="text"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          placeholder="Material"
          required
        />
        <input
          type="text"
          value={alto}
          onChange={(e) => setAlto(e.target.value)}
          placeholder="Alto"
          required
        />
        <input
          type="text"
          value={ancho}
          onChange={(e) => setAncho(e.target.value)}
          placeholder="Ancho"
          required
        />
        <input
          type="text"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          placeholder="Precio"
          required
        />
        <input
          type="text"
          value={imagenUrl}
          onChange={(e) => setImagenUrl(e.target.value)}
          placeholder="URL de la imagen"
          required
        />
        <input
          type="text"
          value={cantidadDisponible}
          onChange={(e) => setCantidadDisponible(e.target.value)}
          placeholder="Cantidad Disponible"
          required
        />
        <input
          type="text"
          value={cantidadReservada}
          onChange={(e) => setCantidadReservada(e.target.value)}
          placeholder="Cantidad Reservada"
          required
        />
        <button type="submit">Guardar</button>
        <button type="button" onClick={handleReset}>Cancelar</button>
      </form>
      <div className="modelos-lista">
        <h3>Lista de Modelos</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Material</th>
              <th>Alto</th>
              <th>Ancho</th>
              <th>Precio</th>
              <th>Imagen</th>
              <th>Cantidad Disponible</th>
              <th>Cantidad Reservada</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {listaModelos.map((modelo) => (
              <tr key={modelo.modelo_id}>
                <td>{modelo.nombre}</td>
                <td>{categorias.find(c => c.categoria_id === modelo.categoria_id)?.nombre}</td>
                <td>{modelo.descripcion}</td>
                <td>{modelo.material}</td>
                <td>{modelo.alto}</td>
                <td>{modelo.ancho}</td>
                <td>{modelo.precio}</td>
                <td><img src={modelo.imagen_url} alt={modelo.nombre} style={{ width: '100px', height: '100px' }} /></td>
                <td>{modelo.Stock?.cantidad_disponible}</td>
                <td>{modelo.Stock?.cantidad_reservada}</td>
                <td>
                  <button
                    className="action-button modify-button"
                    onClick={() => handleModificarModelo(modelo.modelo_id)}
                  >
                    <FontAwesomeIcon icon={faCog} />
                  </button>
                  <button
                    className="action-button delete-button"
                    onClick={() => handleEliminarModelo(modelo.modelo_id)}
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

export default FormularioModelo;
