const InformeService = require('../facades/informesService');
const ResponseFactory = require('../helpers/responseFactory');

exports.generarInformeVentas = async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    try {
        const informePath = await InformeService.generarInformeVentas(fechaInicio, fechaFin);
        res.download(informePath, 'ventas_informe.pdf', err => {
            if (err) {
                const respuesta = ResponseFactory.createErrorResponse(err, 'Error al descargar el informe de ventas');
                res.status(respuesta.status).json(respuesta.body);
            }
        });
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al generar el informe de ventas');
        res.status(respuesta.status).json(respuesta.body);
    }
};

exports.generarInformeInventario = async (req, res) => {
    try {
        const pdfPath = await InformeService.generarInformeInventario();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=inventario_informe_${new Date().toISOString().replace(/[:.]/g, '-')}.pdf`);
        res.sendFile(pdfPath);
    } catch (error) {
        const respuesta = ResponseFactory.createErrorResponse(error, 'Error al generar el informe de inventario');
        res.status(respuesta.status).json(respuesta.body);
    }
};
