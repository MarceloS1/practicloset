import React, { useState } from 'react';
import '../css/FormularioProveedor.css';

const FormularioProveedor = ({ onSubmit }) => {
  const [codigo, setCodigo] = useState('');
  const [estado, setEstado] = useState('');
  const [tiempoEntrega, setTiempoEntrega] = useState('');
  const [articulo, setArticulo] = useState('');
  const [precio, setPrecio] = useState('');

  const handleFormSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      codigo,
      estado,
      tiempoEntrega,
      articulos: [{ nombre: articulo, precio }],
    });
    // Resetear el formulario (opcional)
    setCodigo('');
    setEstado('');
    setTiempoEntrega('');
    setArticulo('');
    setPrecio('');
  };

  return (
    <div className="form-container">
      <h2>Proveedores</h2>
      <form onSubmit={handleFormSubmit} className="provider-form">
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Código del Proveedor"
          required
        />
        <input
          type="text"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          placeholder="Estado del Proveedor"
          required
        />
        <input
          type="text"
          value={tiempoEntrega}
          onChange={(e) => setTiempoEntrega(e.target.value)}
          placeholder="Tiempo de Entrega"
          required
        />
        <input
          type="text"
          value={articulo}
          onChange={(e) => setArticulo(e.target.value)}
          placeholder="Artículo"
          required
        />
        <input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          placeholder="Precio"
          required
        />
        <button type="submit">Guardar Proveedor</button>
      </form>
    </div>
  );
};

export default FormularioProveedor;
