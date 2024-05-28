import React, { useState, useEffect } from 'react';
import axios from 'axios';

const baseUrl = 'http://25.41.163.224:5000';

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [formulario, setFormulario] = useState({
        cliente_id: '',
        fecha_entrega: '',
        estado_pago: 'pendiente',
        modelos: []
    });
    const [metodosPago, setMetodosPago] = useState({});

    useEffect(() => {
        cargarPedidos();
        cargarClientes();
        cargarModelos();
    }, []);

    const cargarPedidos = async () => {
        try {
            const respuesta = await axios.get(`${baseUrl}/pedidos`);
            setPedidos(respuesta.data.data);
        } catch (error) {
            console.error('Error al obtener los pedidos:', error);
        }
    };

    const cargarClientes = async () => {
        try {
            const respuesta = await axios.get(`${baseUrl}/clientes`);
            setClientes(respuesta.data.data);
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
        }
    };

    const cargarModelos = async () => {
        try {
            const respuesta = await axios.get(`${baseUrl}/modelos`);
            setModelos(respuesta.data.data);
        } catch (error) {
            console.error('Error al obtener los modelos:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormulario({ ...formulario, [name]: value });
    };

    const handleDetalleChange = (index, e) => {
        const { name, value } = e.target;
        const detalles = [...formulario.modelos];
        detalles[index][name] = value;
        setFormulario({ ...formulario, modelos: detalles });
    };

    const agregarDetalle = () => {
        setFormulario({
            ...formulario,
            modelos: [...formulario.modelos, { modelo_id: '', cantidad: '' }]
        });
    };

    const eliminarDetalle = (index) => {
        const detalles = [...formulario.modelos];
        detalles.splice(index, 1);
        setFormulario({ ...formulario, modelos: detalles });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${baseUrl}/pedidos`, formulario);
            cargarPedidos();
            resetFormulario();
        } catch (error) {
            console.error('Error al guardar el pedido:', error);
        }
    };

    const resetFormulario = () => {
        setFormulario({
            cliente_id: '',
            fecha_entrega: '',
            estado_pago: 'pendiente',
            modelos: []
        });
    };

    const handlePago = async (pedidoId) => {
        try {
            const metodoPago = metodosPago[pedidoId];
            if (!metodoPago) {
                alert('Por favor seleccione un método de pago.');
                return;
            }

            const respuesta = await axios.post(`${baseUrl}/pagos`, {
                pedido_id: pedidoId,
                metodo_pago: metodoPago,
                fecha_pago: new Date().toISOString()
            });

            if (respuesta.status === 200) {
                cargarPedidos();
                setMetodosPago({ ...metodosPago, [pedidoId]: '' });
                alert('Pago realizado con éxito');
            } else {
                console.error('Error en la respuesta del servidor:', respuesta);
            }
        } catch (error) {
            console.error('Error al realizar el pago:', error);
        }
    };

    const handleMetodoPagoChange = (pedidoId, value) => {
        setMetodosPago({ ...metodosPago, [pedidoId]: value });
    };

    return (
        <div className="form-container" style={{ marginLeft: '20%' }}>
            <h2>Gestión de Pedidos</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Cliente:</label>
                    <select
                        name="cliente_id"
                        value={formulario.cliente_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione un cliente</option>
                        {clientes.map((cliente) => (
                            <option key={cliente.cliente_id} value={cliente.cliente_id}>
                                {cliente.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Fecha de Entrega:</label>
                    <input
                        type="date"
                        name="fecha_entrega"
                        value={formulario.fecha_entrega}
                        onChange={handleChange}
                        required
                    />
                </div>
                <h4>Modelos</h4>
                {formulario.modelos.map((modelo, index) => (
                    <div key={index}>
                        <label>Modelo:</label>
                        <select
                            name="modelo_id"
                            value={modelo.modelo_id}
                            onChange={(e) => handleDetalleChange(index, e)}
                            required
                        >
                            <option value="">Seleccione un modelo</option>
                            {modelos.map((mod) => (
                                <option key={mod.modelo_id} value={mod.modelo_id}>
                                    {mod.nombre}
                                </option>
                            ))}
                        </select>
                        <label>Cantidad:</label>
                        <input
                            type="number"
                            name="cantidad"
                            value={modelo.cantidad}
                            onChange={(e) => handleDetalleChange(index, e)}
                            required
                        />
                        <button type="button" onClick={() => eliminarDetalle(index)}>Eliminar</button>
                    </div>
                ))}
                <button type="button" onClick={agregarDetalle}>Agregar Modelo</button>
                <button type="submit">Crear Pedido</button>
                <button type="button" onClick={resetFormulario}>Cancelar</button>
            </form>
            <h3>Lista de Pedidos</h3>
            <table>
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Fecha de Entrega</th>
                        <th>Estado de Pago</th>
                        <th>Modelos</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map((pedido) => (
                        <tr key={pedido.pedido_id}>
                            <td>{clientes.find(c => c.cliente_id === pedido.cliente_id)?.nombre}</td>
                            <td>{pedido.fecha_entrega.split('T')[0]}</td>
                            <td>{pedido.estado_pago}</td>
                            <td>
                                {pedido.DetallePedidos.map((detalle, index) => (
                                    <div key={index}>
                                        {detalle.Modelo.nombre} - {detalle.cantidad}
                                    </div>
                                ))}
                            </td>
                            <td>
                                {pedido.estado_pago === 'pendiente' && (
                                    <div>
                                        <select
                                            onChange={(e) => handleMetodoPagoChange(pedido.pedido_id, e.target.value)}
                                            value={metodosPago[pedido.pedido_id] || ''}
                                        >
                                            <option value="">Seleccione método de pago</option>
                                            <option value="qr">QR</option>
                                            <option value="tarjeta">Tarjeta</option>
                                            <option value="efectivo">Efectivo</option>
                                        </select>
                                        <button onClick={() => handlePago(pedido.pedido_id)}>Pagar</button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Pedidos;
