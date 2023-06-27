/* eslint-disable linebreak-style */
const router = require('express').Router();
const {
  getUsers, getUserById, getUserInfo, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserInfo);
router.get('/me', getUserById);
router.patch('/me', updateUserProfile);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
