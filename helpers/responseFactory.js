const SuccessResponse = require('../responses/SuccessResponse');
const ErrorResponse = require('../responses/ErrorResponse');
const NotFoundResponse = require('../responses/NotFoundResponse');

class ResponseFactory {
    static createResponse(type, data, message = '') {
        switch(type) {
            case 'success':
                return {
                    status: 200,
                    body: {
                        message: message || 'Operación exitosa',
                        data
                    }
                };
            case 'error':
                return {
                    status: 500,
                    body: {
                        message: message || 'Error durante la operación',
                        error: data.message
                    }
                };
            case 'notFound':
                return {
                    status: 404,
                    body: {
                        message: message || 'Recurso no encontrado'
                    }
                };
            default:
                throw new Error('Tipo de respuesta no reconocido');
        }
    }

    // Métodos anteriores para compatibilidad
    static createSuccessResponse(data, message = 'Operación exitosa') {
        return this.createResponse('success', data, message);
    }

    static createErrorResponse(error, message = 'Error durante la operación') {
        return this.createResponse('error', error, message);
    }

    static createNotFoundResponse(message = 'Recurso no encontrado') {
        return this.createResponse('notFound', null, message);
    }
}

module.exports = ResponseFactory;

