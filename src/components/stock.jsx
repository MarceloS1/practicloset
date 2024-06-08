import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransaccionForm from './transaccionForm';
import FormularioModelo from './modelos';  // Import the FormularioModelo component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCog } from '@fortawesome/free-solid-svg-icons';


const baseUrl = 'http://25.5.98.175:5000';

const GestionStock = () => {
    const [articulos, setArticulos] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [cantidadDisponible, setCantidadDisponible] = useState(0);

    useEffect(() => {
        cargarArticulos();
        cargarModelos();
        cargarCategorias();
        cargarProveedores();
    }, []);

    const cargarArticulos = async () => {
        try {
            const respuesta = await axios.get(`${baseUrl}/articulos/con-stock`);
            setArticulos(respuesta.data.data || []);
        } catch (error) {
            console.error('Error al obtener los artículos:', error);
        }
    };

    const cargarModelos = async () => {
        try {
            const respuesta = await axios.get(`${baseUrl}/modelos`);
            setModelos(respuesta.data.data || []);
        } catch (error) {
            console.error('Error al obtener los modelos:', error);
        }
    };

    const cargarCategorias = async () => {
        try {
            const respuesta = await axios.get(`${baseUrl}/categorias`);
            setCategorias(respuesta.data.data || []);
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
        }
    };

    const cargarProveedores = async () => {
        try {
            const respuesta = await axios.get(`${baseUrl}/proveedores`);
            setProveedores(respuesta.data.data || []);
        } catch (error) {
            console.error('Error al obtener los proveedores:', error);
        }
    };

    const resetFormulario = () => {
        setSelectedItem(null);
        setIsEditing(false);
        setCantidadDisponible(0);
    };

    const editarCantidad = async (e) => {
        e.preventDefault();
        const { id, tipo } = selectedItem;
        const datos = { cantidad_disponible: cantidadDisponible };

        try {
            let respuesta;
            if (tipo === 'articulo') {
                respuesta = await axios.put(`${baseUrl}/stock/articulo/${id}`, datos);
            } else if (tipo === 'modelo') {
                datos.cantidad_reservada = selectedItem.cantidadReservada;
                respuesta = await axios.put(`${baseUrl}/stock/modelo/${id}`, datos);
            }

            if (respuesta.status === 200) {
                resetFormulario();
                cargarArticulos();
                cargarModelos();
            } else {
                console.error('Error en la respuesta del servidor:', respuesta);
            }
        } catch (error) {
            console.error('Error al editar las cantidades:', error);
        }
    };

    const eliminarArticulo = async (articuloId) => {
        try {
            await axios.delete(`${baseUrl}/articulos/${articuloId}`);
            cargarArticulos();
        } catch (error) {
            console.error('Error al eliminar el artículo:', error);
        }
    };

    const eliminarModelo = async (modeloId) => {
        try {
            await axios.delete(`${baseUrl}/modelos/${modeloId}`);
            cargarModelos();
        } catch (error) {
            console.error('Error al eliminar el modelo:', error);
        }
    };

    return (
        <div className="form-container" style={{ marginLeft: '10%' }}>
            <h2>Gestión de Stock</h2>

            {isEditing && (
                <form onSubmit={editarCantidad}>
                    <div>
                        <label>Cantidad Disponible:</label>
                        <input
                            type="number"
                            value={cantidadDisponible}
                            onChange={(e) => setCantidadDisponible(Number(e.target.value))}
                            required
                        />
                    </div>
                    {selectedItem?.tipo === 'modelo' && (
                        <div>
                            <label>Cantidad Reservada:</label>
                            <input
                                type="number"
                                value={selectedItem.cantidadReservada}
                                onChange={(e) => setSelectedItem({ ...selectedItem, cantidadReservada: Number(e.target.value) })}
                                required
                            />
                        </div>
                    )}
                    <button type="submit">Guardar Cambios</button>
                    <button type="button" onClick={resetFormulario}>Cancelar</button>
                </form>
            )}

            <h3>Lista de Artículos</h3>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Tipo</th>
                        <th>Proveedor</th>
                        <th>Cantidad Disponible</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {articulos.map((articulo) => (
                        <tr key={articulo.articulo_id}>
                            <td>{articulo.nombre}</td>
                            <td>{articulo.precio}</td>
                            <td>{articulo.tipo}</td>
                            <td>{proveedores.find(p => p.proveedor_id === articulo.proveedor_id)?.nombre || 'Desconocido'}</td>
                            <td>{articulo.Stock ? articulo.Stock.cantidad_disponible : 0}</td>
                            <td>
                                <button
                                    className="action-button modify-button"
                                    onClick={() => {
                                        setSelectedItem({ id: articulo.articulo_id, tipo: 'articulo' });
                                        setCantidadDisponible(articulo.Stock ? articulo.Stock.cantidad_disponible : 0);
                                        setIsEditing(true);
                                    }}
                                ><FontAwesomeIcon icon={faCog} /></button>
                                <button className="action-button delete-button" onClick={() => eliminarArticulo(articulo.articulo_id)}><FontAwesomeIcon icon={faTrash} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Lista de Modelos</h3>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Material</th>
                        <th>Precio</th>
                        <th>Cantidad Disponible</th>
                        <th>Cantidad Reservada</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {modelos.map((modelo) => (
                        <tr key={modelo.modelo_id}>
                            <td>{modelo.nombre}</td>
                            <td>{modelo.descripcion}</td>
                            <td>{modelo.material}</td>            
                            <td>{modelo.precio}</td>
                            <td>{modelo.Stock ? modelo.Stock.cantidad_disponible : 0}</td>
                            <td>{modelo.Stock ? modelo.Stock.cantidad_reservada : 0}</td>
                            <td>
                                <button
                                    className="action-button modify-button"
                                    onClick={() => {
                                        setSelectedItem({ id: modelo.modelo_id, tipo: 'modelo', cantidadReservada: modelo.Stock ? modelo.Stock.cantidad_reservada : 0 });
                                        setCantidadDisponible(modelo.Stock ? modelo.Stock.cantidad_disponible : 0);
                                        setIsEditing(true);
                                    }}
                                ><FontAwesomeIcon icon={faCog} /></button>
                                <button className="action-button delete-button" onClick={() => eliminarModelo(modelo.modelo_id)}><FontAwesomeIcon icon={faTrash} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <TransaccionForm
                modelos={modelos}
                onTransaccionRealizada={() => {
                    cargarArticulos();
                    cargarModelos();
                }}
            />

            
        </div>
    );
};

export default GestionStock;
