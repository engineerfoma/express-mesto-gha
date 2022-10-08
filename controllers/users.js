const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  BadRequestError,
  NotFoundError,
  ServerError,
  AuthorizationError,
  ConflictError,
} = require('../errors/errors');

const createUser = async (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  try {
    const hashePassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, about, avatar, email, password: hashePassword });
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(BadRequestError).send({ message: 'Ошибка в запросе' });
    }

    if (e.code === 11000) {
      return res.status(ConflictError).send({ message: 'Такой email уже существует' });
    }
    return res.status(ServerError).send({ message: 'Произошла ошибка на сервере' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (e) {
    return res.status(ServerError).send({ message: 'Произошла ошибка на сервере' });
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
      return res.status(BadRequestError).send({ message: 'Ошибка в запросе' });
    }
    return res.status(ServerError).send({ message: 'Произошла ошибка на сервере' });
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
      return res.status(BadRequestError).send({ message: 'Ошибка в запросе' });
    }
    return res.status(ServerError).send({ message: 'Произошла ошибка на сервере' });
  }
};

const updateUserAvatar = async (req, res) => {
  const id = req.user._id;
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(NotFoundError).send({ message: 'Пользователь не найден' });
    }
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(BadRequestError).send({ message: 'Некоректные данные пользователя' });
    }
    return res.status(ServerError).send({ message: 'Произошла ошибка на сервере' });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(AuthorizationError).send({ message: 'Неправильные почта или пароль' });
    }

    const isUserValid = await bcrypt.compare(password, user.password);
    if (!isUserValid) {
      return res.status(AuthorizationError).send({ message: 'Неправильные почта или пароль' });
    }

    const token = jwt.sign({ _id: user._id }, 'SECRET');
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: true,
    });
    return res.send(user);
  } catch (e) {
    return next();
  }
};

module.exports = {
  createUser, getUsers, getUserById, updateUserProfile, updateUserAvatar, login,
};
