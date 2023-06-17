const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');

const { ERROR_NOT_FOUND } = require('../utils/utils');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Что-то пошло не так' });
});

module.exports = router;
