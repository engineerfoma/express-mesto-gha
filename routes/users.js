const { celebrate, Joi } = require('celebrate');
const express = require('express');

const userRoutes = express.Router();
const {
  getUsers, getUserById, updateUserProfile, updateUserAvatar, getMyInfo,
} = require('../controllers/users');

userRoutes.get('/', express.json(), getUsers);
userRoutes.get('/me', express.json(), getMyInfo);

userRoutes.get(
  '/:userId',
  express.json(),
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
  }),
  getUserById,
);

userRoutes.patch(
  '/me',
  express.json(),
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
  express.json(),
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
