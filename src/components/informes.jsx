import React, { useState } from 'react';
import axios from 'axios';

const baseUrl = 'http://25.5.98.175:5000';

const Informes = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const generarInformeVentas = async () => {
    try {
      const response = await axios.get(`${baseUrl}/informes/ventas`, {
        params: { fechaInicio, fechaFin },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ventas_informe_${new Date().toISOString().replace(/[:.]/g, '-')}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error al generar el informe de ventas:', error);
    }
  };

  const generarInformeInventario = async () => {
    try {
      const response = await axios.get(`${baseUrl}/informes/inventario`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inventario_informe_${new Date().toISOString().replace(/[:.]/g, '-')}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error al generar el informe de inventario:', error);
    }
  };

  return (
    <div className="form-container" style={{ marginLeft: '10%' }}>
      <h2>Generar Informes</h2>
      <form className="informes-form">
        <div className="form-group">
          <label htmlFor="fechaInicio">Fecha Inicio:</label>
          <input
            type="date"
            id="fechaInicio"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fechaFin">Fecha Fin:</label>
          <input
            type="date"
            id="fechaFin"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            required
          />
        </div>
        <button type="button" onClick={generarInformeVentas}>
          Generar Informe de Ventas
        </button>
        <button type="button" onClick={generarInformeInventario}>
          Generar Informe de Inventario
        </button>
      </form>
    </div>
  );
};

export default Informes;
