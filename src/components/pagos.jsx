import React, { useState, useEffect } from 'react';
import axios from 'axios';

const baseUrl = 'http://25.5.98.175:5000';

const Pagos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [metodoPago, setMetodoPago] = useState('efectivo');

    useEffect(() => {
        cargarPedidos();
    }, []);

    const cargarPedidos = async () => {
        try {
            const respuesta = await axios.get(`${baseUrl}/pedidos`);
            const pedidosFiltrados = respuesta.data.data.filter(pedido => pedido.estado_pago === 'pendiente' || pedido.estado_pago === 'en_proceso');
            setPedidos(pedidosFiltrados);
        } catch (error) {
            console.error('Error al obtener los pedidos:', error);
        }
    };

    const handlePago = async (pedidoId) => {
        try {
            const fechaPago = new Date().toISOString(); // Obtén la fecha actual en formato ISO
    
            const respuesta = await axios.post(`${baseUrl}/pagos`, {
                pedido_id: pedidoId,
                metodo_pago: metodoPago,
                fecha_pago: fechaPago
            });
    
            if (respuesta.status === 200) {
                cargarPedidos();
                setMetodoPago(''); // Resetear el método de pago después del pago
                alert('Pago realizado con éxito');
            } else {
                console.error('Error en la respuesta del servidor:', respuesta);
            }
        } catch (error) {
            console.error('Error al realizar el pago:', error);
        }
    };

    return (
        <div className="form-container" style={{ marginLeft: '10%' }}>
            <h2>Gestión de Pagos</h2>
            <h3>Pedidos Pendientes o En Proceso</h3>
            <table>
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Fecha de Entrega</th>
                        <th>Estado de Pago</th>
                        <th>Modelos</th>
                        <th>Monto Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map((pedido) => (
                        <tr key={pedido.pedido_id}>
                            <td>{pedido.cliente_id}</td>
                            <td>{pedido.fecha_entrega.split('T')[0]}</td>
                            <td>{pedido.estado_pago}</td>
                            <td>
                                {pedido.detalles.map((detalle, index) => (
                                    <div key={index}>
                                        {detalle.nombre_modelo} - {detalle.cantidad}
                                    </div>
                                ))}
                            </td>
                            <td>{pedido.precio_total}</td>
                            <td>
                                <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                                    <option value="efectivo">Efectivo</option>
                                    <option value="tarjeta">Tarjeta</option>
                                    <option value="qr">QR</option>
                                </select>
                                <button onClick={() => handlePago(pedido.pedido_id)}>Pagar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Pagos;
