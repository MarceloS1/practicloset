// responseFactory.js
class ResponseFactory {
    static createSuccessResponse(data, message = 'Operación exitosa') {
        return {
            status: 200,
            body: {
                message,
                data
            }
        };
    }

    static createErrorResponse(error, message = 'Error durante la operación') {
        return {
            status: 500,
            body: {
                message,
                error: error.message
            }
        };
    }

    static createNotFoundResponse(message = 'Recurso no encontrado') {
        return {
            status: 404,
            body: {
                message
            }
        };
    }
}

module.exports = ResponseFactory;
