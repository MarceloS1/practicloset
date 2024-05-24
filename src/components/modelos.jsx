import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCog } from '@fortawesome/free-solid-svg-icons';

const baseUrl = 'http://25.41.163.224:5000';

const FormularioModelo = ({ onSubmit, onReset }) => {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [material, setMaterial] = useState('');
  const [medida, setMedida] = useState('');
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
      setListaModelos(respuesta.data.data); // Ajuste para obtener los datos correctamente
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
      setMedida(modeloActual.alto + ' x ' + modeloActual.ancho);
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
      setMedida(modeloSeleccionado.alto + ' x ' + modeloSeleccionado.ancho);
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
      alto: medida.split(' x ')[0],
      ancho: medida.split(' x ')[1],
      precio,
      imagen_url: imagenUrl,
    };
  
    try {
      let response;
      if (modeloActual) {
        response = await axios.put(`${baseUrl}/modelos/${modeloActual.modelo_id}`, modeloData);
        setListaModelos(listaModelos.map((modelo) => {
          if (modelo.modelo_id === modeloActual.modelo_id) {
            return response.data.data; // Ajuste para obtener los datos correctamente
          }
          return modelo;
        }));
      } else {
        response = await axios.post(`${baseUrl}/modelos`, modeloData);
        setListaModelos([...listaModelos, response.data.data]); // Ajuste para obtener los datos correctamente
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
    setMedida('');
    setPrecio('');
    setImagenUrl('');
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
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          required
        >
          <option value="">Selecciona un tipo</option>
          <option value="Mueble">Mueble</option>
          <option value="Rejilla">Rejilla</option>
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
          value={medida}
          onChange={(e) => setMedida(e.target.value)}
          placeholder="Medida (Alto x Ancho)"
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
      <div className="modelos-lista">
        <h3>Lista de Modelos</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Material</th>
              <th>Medida</th>
              <th>Precio</th>
              <th>Imagen</th>
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
                <td>{modelo.alto} x {modelo.ancho}</td>
                <td>{modelo.precio}</td>
                <td><img src={modelo.imagen_url} alt={modelo.nombre} style={{ width: '100px', height: '100px' }} /></td>
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
