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
const sequelize = require('sequelize');

exports.generarInformeVentas = async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    try {
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
            const respuesta = ResponseFactory.createNotFoundResponse('No se encontraron pedidos en el rango de fechas proporcionado');
            return res.status(respuesta.status).json(respuesta.body);
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

        writeStream.on('finish', () => {
            res.download(informePath, 'ventas_informe.pdf', err => {
                if (err) {
                    const respuesta = ResponseFactory.createErrorResponse(err, 'Error al descargar el informe de ventas');
                    res.status(respuesta.status).json(respuesta.body);
                }
            });
        });

        writeStream.on('error', (err) => {
            const respuesta = ResponseFactory.createErrorResponse(err, 'Error al generar el informe de ventas');
            res.status(respuesta.status).json(respuesta.body);
        });
    } catch (error) {
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
