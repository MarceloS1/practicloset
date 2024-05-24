import React, { useState } from 'react';
import axios from 'axios';

const baseUrl = 'http://25.5.98.175:5000';

const TransaccionForm = ({ productos, onTransaccionRealizada }) => {
    const [productoId, setProductoId] = useState('');
    const [tipoTransaccion, setTipoTransaccion] = useState('entrada'); // Puede ser 'entrada' o 'salida'
    const [cantidad, setCantidad] = useState(0);
    const [nota, setNota] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const transaccionData = {
            producto_id: productoId,
            tipo_transaccion: tipoTransaccion,
            cantidad,
            nota,
        };

        try {
            const respuesta = await axios.post(`${baseUrl}/transaccion`, transaccionData);

            if (respuesta.status === 201) {
                console.log('Transacción y actualización de stock realizadas con éxito');
                onTransaccionRealizada();
                setProductoId('');
                setTipoTransaccion('entrada');
                setCantidad(0);
                setNota('');
            } else {
                console.error('Error en la respuesta del servidor:', respuesta);
            }
        } catch (error) {
            console.error('Error al realizar la transacción:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h4>Transacción</h4>
            <div>
                <label>Producto:</label>
                <select
                    value={productoId}
                    onChange={(e) => setProductoId(Number(e.target.value))}
                    required
                >
                    <option value="">Selecciona un producto</option>
                    {productos.map((producto) => (
                        <option key={producto.producto_id} value={producto.producto_id}>
                            {producto.nombre}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Tipo de Transacción:</label>
                <select
                    value={tipoTransaccion}
                    onChange={(e) => setTipoTransaccion(e.target.value)}
                    required
                >
                    <option value="entrada">Compra (Entrada)</option>
                    <option value="salida">Venta (Salida)</option>
                </select>
            </div>
            <div>
                <label>Cantidad:</label>
                <input
                    type="number"
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                    required
                />
            </div>
            <div>
                <label>Nota:</label>
                <input
                    type="text"
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                />
            </div>
            <button type="submit">Realizar Transacción</button>
        </form>
    );
};

export default TransaccionForm;
