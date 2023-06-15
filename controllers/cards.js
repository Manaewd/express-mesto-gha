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
  const { name, link } = req.body;

  Card.create({
    name, link, owner: req.user._id,
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

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => new Error('Card not found'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'Card not found') {
        res.status(404).send({ message: 'Card not found' });
      } else {
        res.status(500).send({
          message: 'Internal Server Error',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => new Error('Card not found'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'Card not found') {
        res.status(404).send({ message: 'Card not found' });
      } else {
        res.status(500).send({
          message: 'Internal Server Error',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => new Error('Card not found'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'Card not found') {
        res.status(404).send({ message: 'Card not found' });
      } else {
        res.status(500).send({
          message: 'Internal Server Error',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
