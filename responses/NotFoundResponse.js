const Response = require('./Response');

class NotFoundResponse extends Response {
  constructor(message = 'Recurso no encontrado') {
    super(404, { message });
  }
}

module.exports = NotFoundResponse;