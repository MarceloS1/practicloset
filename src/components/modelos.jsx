import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCog } from '@fortawesome/free-solid-svg-icons';

const baseUrl = 'http://25.5.98.175:5000';

const FormularioModelo = ({ onSubmit, onReset }) => {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [material, setMaterial] = useState('');
  const [alto, setAlto] = useState('');
  const [ancho, setAncho] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [modeloActual, setModeloActual] = useState(null);
  const [listaModelos, setListaModelos] = useState([]);

  useEffect(() => {
    cargarModelos();
  }, []);

  const cargarModelos = async () => {
    try {
      const respuesta = await axios.get(`${baseUrl}/modelos`);
      setListaModelos(respuesta.data);
    } catch (error) {
      console.error('Error al obtener los modelos: ', error);
    }
  };

  useEffect(() => {
    if (modeloActual) {
      setNombre(modeloActual.nombre);
      setTipo(modeloActual.tipo);
      setDescripcion(modeloActual.descripcion);
      setMaterial(modeloActual.material);
      setAlto(modeloActual.alto);
      setAncho(modeloActual.ancho);
      setPrecio(modeloActual.precio);
      setImagenUrl(modeloActual.imagen_url);
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
      setNombre(modeloSeleccionado.nombre);
      setTipo(modeloSeleccionado.tipo);
      setDescripcion(modeloSeleccionado.descripcion);
      setMaterial(modeloSeleccionado.material);
      setAlto(modeloSeleccionado.alto);
      setAncho(modeloSeleccionado.ancho);
      setPrecio(modeloSeleccionado.precio);
      setImagenUrl(modeloSeleccionado.imagen_url);
      setModeloActual(modeloSeleccionado);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const modeloData = {
      nombre,
      tipo,
      descripcion,
      material,
      alto,
      ancho,
      precio,
      imagen_url: imagenUrl,
    };
  
    try {
      let response;
      if (modeloActual) {
        response = await axios.put(`${baseUrl}/modelos/${modeloActual.modelo_id}`, modeloData);
        setListaModelos(listaModelos.map((modelo) => {
          if (modelo.modelo_id === modeloActual.modelo_id) {
            return response.data;
          }
          return modelo;
        }));
      } else {
        response = await axios.post(`${baseUrl}/modelos`, modeloData);
        setListaModelos([...listaModelos, response.data]);
      }
      setModeloActual(null);
      handleReset();
      await cargarModelos();
    } catch (error) {
      console.error('Error al procesar la solicitud', error);
    }
  };

  const handleReset = () => {
    setNombre('');
    setTipo('');
    setDescripcion('');
    setMaterial('');
    setAlto('');
    setAncho('');
    setPrecio('');
    setImagenUrl('');
    onReset();
  };

  return (
    <div className="form-container" style={{marginLeft: '20%'}}>
      <h2>Modelos</h2>
      <form onSubmit={handleFormSubmit} className="model-form">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          required
        />
        <input
          type="text"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          placeholder="Tipo"
          required
        />
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
        <button type="submit">Guardar</button>
        <button type="button" onClick={handleReset}>Cancelar</button>
      </form>
      <div className="model-list">
        <h3>Lista de Modelos</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Material</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {listaModelos.map((modelo) => (
              <tr key={modelo.modelo_id}>
                <td>{modelo.nombre}</td>
                <td>{modelo.tipo}</td>
                <td>{modelo.descripcion}</td>
                <td>{modelo.material}</td>
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
