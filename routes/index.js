const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');

const { ERROR_NOT_FOUND } = require('../utils/utils');

router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Что-то пошло не так' });
});

module.exports = router;
