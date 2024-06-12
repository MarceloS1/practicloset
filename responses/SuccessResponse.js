const Response = require('./Response');

class SuccessResponse extends Response {
  constructor(data, message = 'Operación exitosa') {
    super(200, { message, data });
  }
}

module.exports = SuccessResponse;