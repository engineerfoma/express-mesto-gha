const Card = require('../models/Card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send(cards);
  } catch (e) {
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const createCard = async (req, res) => {
  try {
    const card = await Card.create({ owner: req.user._id, ...req.body });
    res.status(200).send(card);
  } catch (e) {
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const deleteCardById = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndDelete(cardId);
    if (!card) {
      return res.status(401).send({ message: 'карточка не найдена' });
    }
    return res.status(200).send(card);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(400).send({ message: "Ошибка в запросе", ...e });
    }
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!card) {
      return res.status(401).send({ message: 'карточка не найдена' });
    }
    return res.status(200).send(card);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(400).send({ message: "Ошибка в запросе", ...e });
    }
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );
    if (!card) {
      return res.status(401).send({ message: 'карточка не найдена' });
    }
    return res.status(200).send(card);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(400).send({ message: "Ошибка в запросе", ...e });
    }
    return res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

module.exports = {
  createCard, getCards, deleteCardById, likeCard, dislikeCard
};
