import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const FormularioTrabajador = ({ onReset, trabajadorActual }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cedula, setCedula] = useState('');
  const [cargo, setCargo] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [salario, setSalario] = useState('');
  const [listaTrabajadores, setListaTrabajadores] = useState([]);

  const cargarTrabajadores = async () => {
    try {
      const respuesta = await axios.get('http://25.5.98.175:5000/trabajadores');
      setListaTrabajadores(respuesta.data);
    } catch (error) {
      console.error('Error al obtener los trabajadores:', error);
    }
  };

  useEffect(() => {
    cargarTrabajadores();
  }, []);

  useEffect(() => {
    if (trabajadorActual) {
      setNombre(trabajadorActual.nombre);
      setApellido(trabajadorActual.apellido);
      setEmail(trabajadorActual.email);
      setTelefono(trabajadorActual.telefono);
      setCedula(trabajadorActual.cedula);
      setCargo(trabajadorActual.cargo);
      setFechaIngreso(trabajadorActual.fecha_ingreso);
      setSalario(trabajadorActual.salario);
    }
  }, [trabajadorActual]);

  const handleEditarTrabajador = async (trabajadorId) => {
    try {
      const trabajadorParaEditar = listaTrabajadores.find(trabajador => trabajador.trabajador_id === trabajadorId);
      if (!trabajadorParaEditar) {
        console.log('Trabajador no encontrado');
        return;
      }
      setNombre(trabajadorParaEditar.nombre);
      setApellido(trabajadorParaEditar.apellido);
      setEmail(trabajadorParaEditar.email);
      setTelefono(trabajadorParaEditar.telefono);
      setCedula(trabajadorParaEditar.cedula);
      setCargo(trabajadorParaEditar.cargo);
      setFechaIngreso(trabajadorParaEditar.fecha_ingreso);
      setSalario(trabajadorParaEditar.salario);
    } catch (error) {
      console.error('Error al editar el trabajador:', error);
    }
  };

  const handleEliminarTrabajador = async (trabajadorId) => {
    try {
      await axios.delete(`http://25.5.98.175:5000/trabajadores/${trabajadorId}`);
      cargarTrabajadores();
    } catch (error) {
      console.error('Error al eliminar el trabajador:', error);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const datosTrabajador = {
      nombre,
      apellido,
      email,
      telefono,
      cedula,
      cargo,
      fecha_ingreso: fechaIngreso,
      salario
    };

    try {
      let response;
      if (trabajadorActual) {
        console.log(`Actualizando trabajador con ID: ${trabajadorActual.trabajador_id}`);
        response = await axios.put(`http://25.5.98.175:5000/trabajadores/${trabajadorActual.trabajador_id}`, datosTrabajador);
      } else {
        console.log('Agregando nuevo trabajador');
        response = await axios.post('http://25.5.98.175:5000/trabajadores', datosTrabajador);
      }
      console.log('Respuesta del servidor:', response.data);
      handleReset();
      cargarTrabajadores();
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
    }
  };

  const handleReset = () => {
    setNombre('');
    setApellido('');
    setEmail('');
    setTelefono('');
    setCedula('');
    setCargo('');
    setFechaIngreso('');
    setSalario('');
    if (onReset) onReset();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestión de Trabajadores</h2>
      <form onSubmit={handleFormSubmit} style={{ margin: '20px 0' }}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre"
            required
          />
        </div>
        <div>
          <label>Apellido:</label>
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            placeholder="Apellido"
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div>
          <label>Teléfono:</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Teléfono"
            required
          />
        </div>
        <div>
          <label>Cédula:</label>
          <input
            type="text"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            placeholder="Cédula"
            required
          />
        </div>
        <div>
          <label>Cargo:</label>
          <input
            type="text"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            placeholder="Cargo"
            required
          />
        </div>
        <div>
          <label>Fecha de Ingreso:</label>
          <input
            type="date"
            value={fechaIngreso}
            onChange={(e) => setFechaIngreso(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Salario:</label>
          <input
            type="number"
            value={salario}
            onChange={(e) => setSalario(e.target.value)}
            placeholder="Salario"
            required
          />
        </div>
        <button type="submit" style={{ marginRight: '10px' }}>Guardar</button>
        <button type="button" onClick={handleReset}>Cancelar</button>
      </form>
      <div>
        <h3>Lista de Trabajadores</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Cédula</th>
              <th>Cargo</th>
              <th>Fecha de Ingreso</th>
              <th>Salario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {listaTrabajadores.map((trabajador) => (
              <tr key={trabajador.trabajador_id}>
                <td>{trabajador.nombre}</td>
                <td>{trabajador.apellido}</td>
                <td>{trabajador.email}</td>
                <td>{trabajador.telefono}</td>
                <td>{trabajador.cedula}</td>
                <td>{trabajador.cargo}</td>
                <td>{trabajador.fecha_ingreso ? new Date(trabajador.fecha_ingreso).toLocaleDateString() : ''}</td>
                <td>{trabajador.salario}</td>
                <td>
                  <button onClick={() => handleEditarTrabajador(trabajador.trabajador_id)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleEliminarTrabajador(trabajador.trabajador_id)} style={{ marginLeft: '10px' }}>
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

export default FormularioTrabajador;
