const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { Pedido, Stock, Cliente, DetallePedido, Modelo, Articulo } = require('../models');
const sequelize = require('sequelize');

class InformeService {
    async generarInformeVentas(fechaInicio, fechaFin) {
        const pedidos = await Pedido.findAll({
            where: {
                fecha_entrega: {
                    [sequelize.Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
                }
            },
            include: [
                {
                    model: Cliente,
                    attributes: ['cliente_id', 'nombre', 'apellido', 'cedula', 'email', 'telefono', 'direccion']
                },
                {
                    model: DetallePedido,
                    include: {
                        model: Modelo
                    }
                }
            ],
            order: [['fecha_entrega', 'ASC']]
        });

        if (!pedidos.length) {
            throw new Error('No se encontraron pedidos en el rango de fechas proporcionado');
        }

        const informePath = path.join(__dirname, '../informes', `ventas_informe_${new Date().toISOString().replace(/[:.]/g, '-')}.pdf`);

        // Asegúrate de que el directorio existe
        const dir = path.dirname(informePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const doc = new PDFDocument();
        const writeStream = fs.createWriteStream(informePath);

        doc.pipe(writeStream);

        doc.fontSize(18).text('Informe de Ventas', { align: 'center' });
        doc.fontSize(12).text(`Rango de fechas: ${fechaInicio} a ${fechaFin}`, { align: 'center' });
        doc.moveDown();

        pedidos.forEach(pedido => {
            doc.fontSize(14).text(`Pedido ID: ${pedido.pedido_id}`);
            doc.fontSize(12).text(`Cliente: ${pedido.Cliente.nombre} ${pedido.Cliente.apellido}`);
            doc.text(`Fecha de entrega: ${pedido.fecha_entrega}`);
            doc.text(`Estado de pago: ${pedido.estado_pago}`);
            doc.text(`Precio total: ${pedido.precio_total}`);
            doc.text('Detalles del pedido:');
            pedido.DetallePedidos.forEach(detalle => {
                doc.text(` - Modelo: ${detalle.Modelo.nombre}, Cantidad: ${detalle.cantidad}`);
            });
            doc.moveDown();
        });

        doc.end();

        return new Promise((resolve, reject) => {
            writeStream.on('finish', () => {
                resolve(informePath);
            });

            writeStream.on('error', (err) => {
                reject(err);
            });
        });
    }

    async generarInformeInventario() {
        const modelos = await Modelo.findAll({ include: [Stock] });
        const articulos = await Articulo.findAll({ include: [Stock] });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const pdfPath = path.join(__dirname, `../informes/inventario_informe_${timestamp}.pdf`);

        // Asegúrate de que el directorio existe
        const dir = path.dirname(pdfPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const doc = new PDFDocument();
        const writeStream = fs.createWriteStream(pdfPath);

        doc.pipe(writeStream);

        doc.fontSize(18).text('Informe de Inventario', { align: 'center' });
        doc.moveDown();

        doc.fontSize(16).text('Modelos');
        modelos.forEach(modelo => {
            doc.fontSize(12).text(`Modelo: ${modelo.nombre}`);
            doc.text(`Descripción: ${modelo.descripcion}`);
            doc.text(`Cantidad Disponible: ${modelo.Stock?.cantidad_disponible || 0}`);
            doc.text(`Cantidad Reservada: ${modelo.Stock?.cantidad_reservada || 0}`);
            doc.moveDown();
        });

        doc.addPage();

        doc.fontSize(16).text('Artículos');
        articulos.forEach(articulo => {
            doc.fontSize(12).text(`Artículo: ${articulo.nombre}`);
            doc.text(`Cantidad Disponible: ${articulo.Stock?.cantidad_disponible || 0}`);
            doc.text(`Cantidad Reservada: ${articulo.Stock?.cantidad_reservada || 0}`);
            doc.moveDown();
        });

        doc.end();

        return new Promise((resolve, reject) => {
            writeStream.on('finish', () => {
                resolve(pdfPath);
            });

            writeStream.on('error', (err) => {
                reject(err);
            });
        });
    }
}

module.exports = new InformeService();
