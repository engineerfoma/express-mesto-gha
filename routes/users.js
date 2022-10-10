const { celebrate, Joi } = require('celebrate');
const express = require('express');

const userRoutes = express.Router();
const {
  getUsers, getUserById, updateUserProfile, updateUserAvatar, getMyInfo,
} = require('../controllers/users');

userRoutes.get('/', getUsers);
userRoutes.get('/me', getMyInfo);

userRoutes.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().alphanum().length(24),
    }),
  }),
  getUserById,
);

userRoutes.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUserProfile,
);

userRoutes.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/),
    }),
  }),
  updateUserAvatar,
);

module.exports = {
  userRoutes,
};
