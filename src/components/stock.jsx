import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransaccionForm from './transaccionForm'

const baseUrl = 'http://25.41.163.224:5000';

const GestionStock = () => {
    const [modelos, setModelos] = useState([]);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [material, setMaterial] = useState('');
    const [alto, setAlto] = useState('');
    const [ancho, setAncho] = useState('');
    const [precio, setPrecio] = useState('');
    const [imagenUrl, setImagenUrl] = useState('');
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

    const resetFormulario = () => {
        setNombre('');
        setDescripcion('');
        setCategoriaId('');
        setMaterial('');
        setAlto('');
        setAncho('');
        setPrecio('');
        setImagenUrl('');
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
            material,
            alto,
            ancho,
            precio,
            imagen_url: imagenUrl,
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
            material,
            alto,
            ancho,
            precio,
            imagen_url: imagenUrl,
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

    const eliminarModelo = async (modeloId) => {
        try {
            await axios.delete(`${baseUrl}/modelos/${modeloId}`);
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
                        {categorias.map((categoria) => (
                            <option key={categoria.categoria_id} value={categoria.categoria_id}>
                                {categoria.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Material:</label>
                    <input
                        type="text"
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                    />
                </div>
                <div>
                    <label>Alto:</label>
                    <input
                        type="number"
                        value={alto}
                        onChange={(e) => setAlto(Number(e.target.value))}
                    />
                </div>
                <div>
                    <label>Ancho:</label>
                    <input
                        type="number"
                        value={ancho}
                        onChange={(e) => setAncho(Number(e.target.value))}
                    />
                </div>
                <div>
                    <label>Precio:</label>
                    <input
                        type="number"
                        value={precio}
                        onChange={(e) => setPrecio(Number(e.target.value))}
                        required
                    />
                </div>
                <div>
                    <label>Imagen URL:</label>
                    <input
                        type="text"
                        value={imagenUrl}
                        onChange={(e) => setImagenUrl(e.target.value)}
                    />
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
                    {modelos.map((modelo) => (
                        <tr key={modelo.modelo_id}>
                            <td>{modelo.nombre}</td>
                            <td>{modelo.descripcion}</td>
                            <td>{modelo.material}</td>
                            <td>{modelo.alto}</td>
                            <td>{modelo.ancho}</td>
                            <td>{modelo.precio}</td>
                            <td>{modelo.imagen_url}</td>
                            <td>{modelo.Stock.cantidad_disponible}</td>
                            <td>{modelo.Stock.cantidad_reservada}</td>
                            <td>
                                <button
                                    onClick={() => {
                                        setNombre(modelo.nombre);
                                        setDescripcion(modelo.descripcion);
                                        setCategoriaId(modelo.categoria_id);
                                        setMaterial(modelo.material);
                                        setAlto(modelo.alto);
                                        setAncho(modelo.ancho);
                                        setPrecio(modelo.precio);
                                        setImagenUrl(modelo.imagen_url);
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
