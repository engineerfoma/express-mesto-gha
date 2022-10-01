const User = require('../models/User');
const { BadRequestError, NotFoundError, ServerError } = require('../errors/errors');

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(BadRequestError).send({ message: 'Ошибка в запросе', ...e });
    }
    return res.status(ServerError).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (e) {
    return res.status(ServerError).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(NotFoundError).send({ message: 'Пользователь не найден' });
    }
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(BadRequestError).send({ message: 'Ошибка в запросе', ...e });
    }
    return res.status(ServerError).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const updateUserProfile = async (req, res) => {
  const id = req.user._id;
  const { name, about } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(NotFoundError).send({ message: 'Пользователь не найден' });
    }
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(BadRequestError).send({ message: 'Ошибка в запросе', ...e });
    }
    return res.status(ServerError).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const updateUserAvatar = async (req, res) => {
  const id = req.user._id;
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { avatar },
      { new: true },
    );
    if (!user) {
      return res.status(NotFoundError).send({ message: 'Пользователь не найден' });
    }
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(BadRequestError).send({ message: 'Некоректные данные пользователя' });
    }
    return res.status(ServerError).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

module.exports = {
  createUser, getUsers, getUserById, updateUserProfile, updateUserAvatar,
};
