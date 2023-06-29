/* eslint-disable func-names */
/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Слишком короткое имя'],
    maxlength: [30, 'Слишком длинное имя'],
  },
  about: {
    default: 'Исследователь',
    type: String,
    minlength: [2, 'Слишком мало символов'],
    maxlength: [30, 'Слишком много символов'],
  },
  avatar: {
    default: 'https://kadet39.ru/wp-content/uploads/5/e/c/5ec1d3e5e54b8560c3a21e3c0aa24f77.jpeg',
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Обязательно для заполненения'],
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный адрес почты',
    },
  },
  password: {
    type: String,
    select: false,
    required: [true, 'Обязательно для заполненения'],
  },
}, { versionKey: false });

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;

  return user;
};

module.exports = mongoose.model('user', userSchema);
