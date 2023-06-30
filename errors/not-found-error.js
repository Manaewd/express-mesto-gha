/* eslint-disable linebreak-style */
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = message;
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
