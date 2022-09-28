const Card = require('../models/Card');

const createCard = (req, res) => {
  const card = new User(req.body).save();
  res.status(200).send(card);
};

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (e) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const deleteCardById = async (req, res) => {
  const { id } = req.params;
  try {
    if(!card) {
      return res.status(401).send({message: 'карочка не найдена'});
    }
    const card = await Card.findById(id);
    return res.status(200).send(card);
  } catch (e) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const likeCard = async (req, res) => {
  const { id } = req.user._id;
  // try {
  //   if(!card) {
  //     return res.status(401).send({message: 'карочка не найдена'});
  //   }
  //   const card = await Card.findById(id);
  //   return res.status(200).send(card);
  // } catch (e) {
  //   res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  // }
};

const dislikeCard = async (req, res) => {
  const { id } = req.user._id;
  // try {
  //   if(!card) {
  //     return res.status(401).send({message: 'карочка не найдена'});
  //   }
  //   const card = await Card.findById(id);
  //   return res.status(200).send(card);
  // } catch (e) {
  //   res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  // }
};


module.exports.createCard = (req, res) => {
  console.log(req.user._id);
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
module.exports = { createCard, getCards, deleteCardById, likeCard, dislikeCard };
