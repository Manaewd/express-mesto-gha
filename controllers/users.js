/* eslint-disable linebreak-style */
const User = require('../models/user');
const { ERROR_INCORRECT_DATA, ERROR_NOT_FOUND, ERROR_DEFAULT } = require('../utils/utils');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка', err: err.message, stack: err.stack }));
};

const getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .orFail(() => new Error('Not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка', err: err.message, stack: err.stack });
      }
    });
};

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка', err: err.message, stack: err.stack }));
};

const updateUserProfile = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(_id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => new Error('User Not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(ERROR_NOT_FOUND).send({ message: `Пользователь по указанному id:${_id} не найден` });
      } else if (err.name === 'CastError') {
        res.status(ERROR_INCORRECT_DATA).send({ message: 'Переданы некорректные данные при создании пользователя' })
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка', err: err.message, stack: err.stack });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;

  User.findByIdAndUpdate(_id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => new Error('User Not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(ERROR_NOT_FOUND).send({ message: `Пользователь по указанному id:${_id} не найден` });
      } else if (err.name === 'CastError') {
        res.status(ERROR_INCORRECT_DATA).send({ message: 'Переданы некорректные данные при создании пользователя' })
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка', err: err.message, stack: err.stack });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
