import React from 'react';
import '../css/ListaDeProveedores.css';


const ListaDeProveedores = ({ proveedores, onUpdate, onDelete }) => {
    return (
        <div className="list-container">
          {proveedores.map((proveedor, index) => (
            <div className="provider-entry" key={index}>
              {/* ... datos del proveedor */}
              <div className="actions">
                <button onClick={() => onUpdate(proveedor.codigo)}>Modificar</button>
                <button onClick={() => onDelete(proveedor.codigo)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      );
    };
    
    export default ListaDeProveedores;
