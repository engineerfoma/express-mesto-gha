const Card = require('../models/Card');
const { BadRequestError } = require('../errors/bad-request-err');
const { NotFoundError } = require('../errors/not-found-err');
const { ForbiddenError } = require('../errors/forbidden-err');
const { ServerError } = require('../errors/server-err');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send(cards);
  } catch (e) {
    return next(new ServerError('Произошла ошибка на сервере'));
  }
};

const createCard = async (req, res, next) => {
  try {
    const card = await Card.create({ owner: req.user._id, ...req.body });
    return res.status(200).send(card);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return next(new BadRequestError('Ошибка в запросе'));
    }
    return next();
  }
};

const deleteCardById = async (req, res, next) => {
  const { cardId } = req.params;
  const currentUserId = req.user._id;
  try {
    if (!cardId) {
      return next(new NotFoundError('карточка не найдена'));
    }
    const card = await Card.findById(cardId);
    const cardOwner = await Card.findByIdAndDelete(cardId);
    if (cardOwner !== currentUserId) {
      return next(new ForbiddenError('Не хватает прав на удаление чужой карточки!'));
    }
    await Card.findByIdAndDelete(cardId);

    return res.status(200).send(card);
  } catch (e) {
    if (e.name === 'CastError') {
      return next(new BadRequestError('Ошибка в запросе'));
    }
    return next();
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return next(new NotFoundError('карточка не найдена'));
    }
    return res.status(200).send(card);
  } catch (e) {
    if (e.name === 'CastError') {
      return next(new BadRequestError('Ошибка в запросе'));
    }
    return next();
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return next(new NotFoundError('карточка не найдена'));
    }
    return res.status(200).send(card);
  } catch (e) {
    if (e.name === 'CastError') {
      return next(new BadRequestError('Ошибка в запросе'));
    }
    return next();
  }
};

module.exports = {
  createCard, getCards, deleteCardById, likeCard, dislikeCard,
};
