/* eslint-disable linebreak-style */
class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = message;
    this.statusCode = 401;
  }
}

module.exports = AuthError;
