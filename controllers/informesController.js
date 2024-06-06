const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Pedido = require('../models/Pedido');
const Stock = require('../models/Stock');
const Cliente = require('../models/Cliente');
const ResponseFactory = require('../helpers/ResponseFactory');
const DetallePedido = require('../models/DetallePedido');
const Modelo = require('../models/Modelo');
const Articulo = require('../models/articulo');
const { Op } = require('sequelize');

exports.generarInformeVentas = async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    try {
        const pedidos = await Pedido.findAll({
            where: {
                fecha_entrega: {
                    [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
                }
            },
            include: [
                { model: Cliente },
                {
                    model: DetallePedido,
                    include: [Modelo]
                }
            ],
            order: [['fecha_entrega', 'ASC']]
        });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const pdfPath = path.join(__dirname, `../informes/ventas_informe_${timestamp}.pdf`);

        const doc = new PDFDocument();

        doc.pipe(fs.createWriteStream(pdfPath));
        doc.pipe(res);

        doc.fontSize(18).text('Informe de Ventas', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Fechas: Desde ${fechaInicio} hasta ${fechaFin}`, { align: 'center' });
        doc.moveDown();

        pedidos.forEach(pedido => {
            doc.fontSize(12).text(`Pedido ID: ${pedido.pedido_id}`);
            doc.text(`Cliente: ${pedido.Cliente.nombre} ${pedido.Cliente.apellido}`);
            doc.text(`Fecha de Entrega: ${pedido.fecha_entrega}`);
            doc.text(`Estado de Pago: ${pedido.estado_pago}`);
            doc.text(`Precio Total: ${pedido.precio_total}`);
            doc.moveDown();

            pedido.DetallePedidos.forEach(detalle => {
                doc.text(` - Modelo: ${detalle.Modelo.nombre}`);
                doc.text(` - Cantidad: ${detalle.cantidad}`);
                doc.text(` - Precio: ${detalle.Modelo.precio}`);
                doc.moveDown();
            });

            doc.moveDown();
        });

        doc.end();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=ventas_informe_${timestamp}.pdf`);
    } catch (error) {
        console.error('Error al generar el informe de ventas:', error.message);
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al generar el informe de ventas');
        res.status(respuesta.status).json(respuesta.body);
    }
};

exports.generarInformeInventario = async (req, res) => {
    try {
        const modelos = await Modelo.findAll({ include: [Stock] });
        const articulos = await Articulo.findAll({ include: [Stock] });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const pdfPath = path.join(__dirname, `../informes/inventario_informe_${timestamp}.pdf`);

        const doc = new PDFDocument();

        doc.pipe(fs.createWriteStream(pdfPath));
        doc.pipe(res);

        doc.fontSize(18).text('Informe de Inventario', { align: 'center' });
        doc.moveDown();

        doc.fontSize(16).text('Modelos');
        modelos.forEach(modelo => {
            doc.fontSize(12).text(`Modelo: ${modelo.nombre}`);
            doc.text(`Descripción: ${modelo.descripcion}`);
            doc.text(`Cantidad Disponible: ${modelo.Stock.cantidad_disponible}`);
            doc.text(`Cantidad Reservada: ${modelo.Stock.cantidad_reservada}`);
            doc.moveDown();
        });

        doc.addPage();

        doc.fontSize(16).text('Artículos');
        articulos.forEach(articulo => {
            doc.fontSize(12).text(`Artículo: ${articulo.nombre}`);
            doc.text(`Descripción: ${articulo.descripcion}`);
            doc.text(`Cantidad Disponible: ${articulo.Stock.cantidad_disponible}`);
            doc.text(`Cantidad Reservada: ${articulo.Stock.cantidad_reservada}`);
            doc.moveDown();
        });

        doc.end();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=inventario_informe_${timestamp}.pdf`);
    } catch (error) {
        console.error('Error al generar el informe de inventario:', error.message);
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al generar el informe de inventario');
        res.status(respuesta.status).json(respuesta.body);
    }
}
