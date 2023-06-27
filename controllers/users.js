/* eslint-disable linebreak-style */
const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');
const { ERROR_INCORRECT_DATA, ERROR_NOT_FOUND, ERROR_DEFAULT } = require('../utils/utils');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка', err: err.message, stack: err.stack }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error('User not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'User not found') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_INCORRECT_DATA).send({ message: `Данные некорректны ${err.message}. Проверьте id пользователя` });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка', err: err.message, stack: err.stack });
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(String(password), 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.status(201).send({ data: user.toJSON() }))
        .catch(next);
    })
    .catch(next);
};

// .catch((err) => {
//   if (err.name === 'ValidationError') {
//     return res.status(ERROR_INCORRECT_DATA)
// .send({ message: 'Переданы некорректные данные при создании пользователя' });
//   }
//   return res.status(ERROR_DEFAULT).send({ message: err.message });
// });

const updateUserProfile = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(_id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные при создании пользователя' });
      } if (err.name === 'CastError') {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
      }
      return res.status(ERROR_DEFAULT).send({ message: err.message });
    });
};

const updateUserAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;

  User.findByIdAndUpdate(_id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_NOT_FOUND)
          .send({ message: 'Пользователь по указанному id не найден' });
      }
      if (err.name === 'ValidationError') {
        return res.status(ERROR_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(ERROR_DEFAULT).send({ message: err.message });
    });
};

const getUserInfo = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail(() => new Error('User not found'))
    .then((user) => {
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const jwt = jsonWebToken.sign({
              _id: user._id,
            }, process.env.JWT_SECRET);
            res.cookie('jwt', jwt, {
              maxAge: 360000 * 24 * 7,
              httpOnly: true,
              sameSite: true,
            });

            res.send({ data: user.toJSON() });
          } else {
            res.status(401).send({ message: 'Неверные данные для входа' });
          }
        });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  getUserInfo,
  login,
};
