const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Pedido = require('../models/Pedido');
const Stock = require('../models/Stock');
const Cliente = require('../models/Cliente');
const ResponseFactory = require('../helpers/ResponseFactory');
const DetallePedido = require('../models/DetallePedido');
const Modelo = require('../models/Modelo');
const { Op } = require('sequelize');

const generarPDF = (data, tipo) => {
    const doc = new PDFDocument();
    const filePath = `./informes/${tipo}_informe.pdf`;

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(18).text(`Informe de ${tipo}`, { align: 'center' });

    doc.fontSize(12).text(JSON.stringify(data, null, 2), {
        width: 410,
        align: 'left'
    });

    doc.end();
    return filePath;
};

exports.generarInformeVentas = async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        if (!startDate || !endDate) {
            throw new Error('Faltan los parámetros startDate o endDate');
        }

        const pedidos = await Pedido.findAll({
            where: {
                fecha_entrega: {
                    [Op.between]: [new Date(startDate), new Date(endDate)]
                }
            },
            include: [
                { model: Cliente },
                { model: DetallePedido, include: [Modelo] }
            ]
        });

        const informesDir = path.join(__dirname, '../informes');
        if (!fs.existsSync(informesDir)) {
            fs.mkdirSync(informesDir, { recursive: true });
        }

        const informePath = path.join(informesDir, 'ventas_informe.pdf');
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(informePath);

        doc.pipe(stream);

        // Título
        doc.fontSize(20).text('Informe de Ventas', { align: 'center' });

        // Fechas
        doc.fontSize(12).text(`Desde: ${startDate} Hasta: ${endDate}`, { align: 'center' });

        doc.moveDown();

        // Tabla de pedidos
        pedidos.forEach(pedido => {
            doc.fontSize(12).text(`Pedido ID: ${pedido.pedido_id}`);
            doc.fontSize(12).text(`Cliente: ${pedido.Cliente.nombre} ${pedido.Cliente.apellido}`);
            doc.fontSize(12).text(`Fecha de Entrega: ${pedido.fecha_entrega}`);
            doc.fontSize(12).text(`Estado de Pago: ${pedido.estado_pago}`);
            doc.fontSize(12).text(`Precio Total: ${pedido.precio_total}`);

            doc.moveDown();

            doc.fontSize(12).text('Detalles del Pedido:');
            pedido.DetallePedidos.forEach(detalle => {
                doc.fontSize(12).text(`- Modelo: ${detalle.Modelo.nombre}, Cantidad: ${detalle.cantidad}`);
            });

            doc.moveDown();
        });

        doc.end();

        stream.on('finish', () => {
            const respuesta = ResponseFactory.createSuccessResponse({ path: informePath }, 'Informe de ventas generado exitosamente');
            res.status(respuesta.status).json(respuesta.body);
        });

        stream.on('error', (error) => {
            const respuesta = ResponseFactory.createErrorResponse(error, 'Error al generar el informe de ventas');
            res.status(respuesta.status).json(respuesta.body);
        });

    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al generar el informe de ventas');
        res.status(respuesta.status).json(respuesta.body);
    }
};

exports.generarInformeInventario = async (req, res) => {
    try {
        const inventario = await Stock.findAll({
            include: [Modelo]
        });

        const filePath = generarPDF(inventario, 'inventario');
        res.download(filePath);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al generar el informe de inventario');
        res.status(respuesta.status).json(respuesta.body);
    }
};

exports.generarInformeClientes = async (req, res) => {
    try {
        const clientes = await Cliente.findAll({
            include: [{ model: Pedido, include: [DetallePedido, Pagos] }]
        });

        const filePath = generarPDF(clientes, 'clientes');
        res.download(filePath);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al generar el informe de clientes');
        res.status(respuesta.status).json(respuesta.body);
    }
};
