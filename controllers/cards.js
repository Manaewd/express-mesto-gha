/* eslint-disable linebreak-style */
const Card = require('../models/card');
const { ERROR_INCORRECT_DATA, ERROR_NOT_FOUND, ERROR_DEFAULT } = require('../utils/utils');

const getCards = (req, res) => {
  Card.find({}).then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(ERROR_DEFAULT).send({
      message: 'Произошла ошибка',
      err: err.message,
      stack: err.stack,
    }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INCORRECT_DATA)
          .send(err);
      } else {
        res.status(ERROR_DEFAULT).send({
          err: err.message,
        });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_INCORRECT_DATA).send({ message: 'Переданы некорректные данные для удаления карточки' });
      }
      return res.status(ERROR_DEFAULT).send({ message: err.message });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_INCORRECT_DATA).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      return res.status(ERROR_DEFAULT).send({ message: err.message });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_INCORRECT_DATA).send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      return res.status(ERROR_DEFAULT).send({ message: err.message });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
