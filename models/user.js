/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле обязательно для заполненения'],
    minlength: [2, 'Слишком короткое имя'],
    maxlength: [30, 'Слишком длинное имя'],
  },
  about: {
    type: String,
    required: [true, 'Поле обязательно для заполненения'],
    minlength: [2, 'Слишком мало символов'],
    maxlength: [30, 'Слишком много символов'],
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
    required: true,
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
