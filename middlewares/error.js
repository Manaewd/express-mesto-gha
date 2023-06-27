/* eslint-disable max-classes-per-file */
/* eslint-disable linebreak-style */
class UserNotFound extends Error {
  // eslint-disable-next-line no-unused-vars
  constructor(err) {
    super(err);
    this.message = 'Пользователь не найден';
    this.statusCode = 404;
  }
}

class AbstractError extends Error {
  constructor(err) {
    super(err);
    this.message = err.body;
    this.status = err.statusCode;
  }
}

const errorHandler = (err, req, res, next) => {
  let error;

  if (err.statusCode === 404) {
    error = new UserNotFound();
  } else {
    error = new AbstractError(err);
  }

  res.status(err.statusCode).send({ message: error.message });

  next();
};

module.exports = errorHandler;
