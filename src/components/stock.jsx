import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransaccionForm from './transaccionForm';

const baseUrl = 'http://25.41.163.224:5000';

const GestionStock = () => {
    const [modelos, setModelos] = useState([]);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [cantidadDisponible, setCantidadDisponible] = useState('');
    const [cantidadReservada, setCantidadReservada] = useState('');
    const [modeloId, setModeloId] = useState(null);
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        cargarModelos();
        cargarCategorias();
    }, []);

    const cargarModelos = async () => {
        try {
            const respuesta = await axios.get(`${baseUrl}/modelos`);
            setModelos(respuesta.data.data);
        } catch (error) {
            console.error('Error al obtener los modelos:', error);
        }
    };

    const cargarCategorias = async () => {
        try {
            const respuesta = await axios.get(`${baseUrl}/categorias`);
            setCategorias(respuesta.data.data);
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
        }
    };

    const resetFormulario = () => {
        setNombre('');
        setDescripcion('');
        setCategoriaId('');
        setCantidadDisponible('');
        setCantidadReservada('');
        setModeloId(null);
    };

    const agregarModelo = async (e) => {
        e.preventDefault();
        const datosModelo = {
            nombre,
            descripcion,
            categoria_id: categoriaId,
            cantidad_disponible: cantidadDisponible,
            cantidad_reservada: cantidadReservada,
        };
        try {
            const respuesta = await axios.post(`${baseUrl}/modelos`, datosModelo);
            setModelos([...modelos, respuesta.data.data]);
            resetFormulario();
        } catch (error) {
            console.error('Error al agregar el modelo:', error);
        }
    };

    const editarModelo = async (e) => {
        e.preventDefault();

        const datosModelo = {
            nombre,
            descripcion,
            categoria_id: categoriaId,
            cantidad_disponible: cantidadDisponible,
            cantidad_reservada: cantidadReservada,
        };

        try {
            const respuesta = await axios.put(`${baseUrl}/modelos/${modeloId}`, datosModelo);

            if (respuesta.status === 200) {
                const modeloEditado = respuesta.data.data;
                setModelos(modelos.map((modelo) =>
                    modelo.modelo_id === modeloId ? modeloEditado : modelo
                ));
                resetFormulario();
                cargarModelos();
            } else {
                console.error('Error en la respuesta del servidor:', respuesta);
            }
        } catch (error) {
            console.error('Error al editar el modelo:', error);
        }
    };

    const editarCantidades = async () => {
        const datosStock = {
            cantidad_disponible: cantidadDisponible,
            cantidad_reservada: cantidadReservada,
        };

        try {
            const respuesta = await axios.put(`${baseUrl}/stock/modelo/${modeloId}`, datosStock);

            if (respuesta.status === 200) {
                const stockEditado = respuesta.data.data;
                setModelos(modelos.map((modelo) => {
                    if (modelo.modelo_id === modeloId) {
                        return {
                            ...modelo,
                            cantidad_disponible: stockEditado.cantidad_disponible,
                            cantidad_reservada: stockEditado.cantidad_reservada,
                        };
                    }
                    return modelo;
                }));
                resetFormulario();
            } else {
                console.error('Error en la respuesta del servidor:', respuesta);
            }
        } catch (error) {
            console.error('Error al editar el stock del modelo:', error);
        }
    };

    const eliminarModelo = async (modeloId) => {
        try {
            await axios.delete(`${baseUrl}/stock/modelo/${modeloId}`);
            cargarModelos();
        } catch (error) {
            console.error('Error al eliminar el modelo:', error);
        }
    };

    return (
        <div className="form-container" style={{ marginLeft: '20%' }}>
            <h2>Gestión de Stock</h2>

            <form onSubmit={(e) => {
                e.preventDefault();
                if (modeloId) {
                    editarModelo(e);
                    editarCantidades();
                } else {
                    agregarModelo(e);
                }
            }}>
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
                        {categorias
                            .filter(categoria => categoria.nombre === 'Muebles' || categoria.nombre === 'Rejillas')
                            .map((categoria) => (
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
                <button type="submit">{modeloId ? 'Guardar Cambios' : 'Agregar Modelo'}</button>
                {modeloId && (
                    <button type="button" onClick={resetFormulario}>
                        Cancelar
                    </button>
                )}
            </form>

            <h3>Lista de Modelos</h3>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Material</th>
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
                            <td>{modelo.Stock.cantidad_disponible}</td>
                            <td>{modelo.Stock.cantidad_reservada}</td>
                            <td>
                                <button
                                    onClick={() => {
                                        setNombre(modelo.nombre);
                                        setDescripcion(modelo.descripcion);
                                        setCategoriaId(modelo.categoria_id);
                                        setCantidadDisponible(modelo.Stock.cantidad_disponible);
                                        setCantidadReservada(modelo.Stock.cantidad_reservada);
                                        setModeloId(modelo.modelo_id);
                                    }}
                                >Editar</button>
                                <button onClick={() => eliminarModelo(modelo.modelo_id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <TransaccionForm
                modelos={modelos}
                onTransaccionRealizada={cargarModelos}
            />
        </div>
    );
};

export default GestionStock;
