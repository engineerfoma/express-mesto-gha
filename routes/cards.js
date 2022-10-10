const express = require('express');
const { celebrate, Joi } = require('celebrate');

const cardRoutes = express.Router();
const {
  createCard, getCards, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRoutes.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().regex(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/),
    }),
  }),
  createCard,
);

cardRoutes.get('/', getCards);
cardRoutes.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().alphanum().length(24),
    }),
  }),
  deleteCardById,
);

cardRoutes.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().alphanum().length(24),
    }),
  }),
  likeCard,
);

cardRoutes.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().alphanum().length(24),
    }),
  }),
  dislikeCard,
);

module.exports = {
  cardRoutes,
};
