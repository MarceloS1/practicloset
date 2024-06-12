const Response = require('./Response');

class ErrorResponse extends Response {
  constructor(error, message = 'Error durante la operación') {
    super(500, { message, error: error.message });
  }
}

module.exports = ErrorResponse;