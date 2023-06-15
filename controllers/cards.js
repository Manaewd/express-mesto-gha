/* eslint-disable linebreak-style */
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({}).then((card) => res.status(200).send(card)).catch((err) => res.status(500).send({
    message: 'Internal Server Error',
    err: err.message,
    stack: err.stack,
  }));
};

const createCard = (req, res) => {
  Card.create({
    ...req.body,
    owner: req.user._id,
  }).then((card) => res.status(201).send(card)).catch((err) => {
    if (err.message.includes('validation failed')) {
      res.status(400).send({
        message: 'Вы ввели некоректные данные',
      });
    } else {
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    }
  });
};

// const deleteCard = (req, res) => {
  
// }
module.exports = {
  getCards,
  createCard,
};
