const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { BadRequestError } = require('../errors/bad-request-err');
const { NotFoundError } = require('../errors/not-found-err');
const { AuthorizationError } = require('../errors/authorization-err');
const { ConflictError } = require('../errors/conflict-err');

const createUser = async (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  try {
    const hashePassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashePassword,
    });
    return res.status(200).send(user.toObject());
  } catch (e) {
    if (e.name === 'ValidationError') {
      return next(new BadRequestError('Ошибка в запросе'));
    }

    if (e.code === 11000) {
      return next(new ConflictError('Такой email уже существует'));
    }
    return next(e);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (e) {
    return next(e);
  }
};

const getUserById = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'CastError') {
      return next(new BadRequestError('Ошибка в запросе'));
    }
    return next(e);
  }
};

const updateUserProfile = async (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return next(new BadRequestError('Ошибка в запросе'));
    }
    return next(e);
  }
};

const updateUserAvatar = async (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.status(200).send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return next(new BadRequestError('Некоректные данные пользователя'));
    }
    return next(e);
  }
};

const login = async (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new AuthorizationError('Неправильные почта или пароль'));
    }

    const isUserValid = await bcrypt.compare(password, user.password);
    if (!isUserValid) {
      return next(new AuthorizationError('Неправильные почта или пароль'));
    }

    const token = jwt.sign({ _id: user._id }, 'qwerty');
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: true,
    });
    return res.send({
      name,
      about,
      avatar,
      email,
    });
  } catch (e) {
    return next(e);
  }
};

const getMyInfo = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    return res.send(user);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  createUser, getUsers, getUserById, updateUserProfile, updateUserAvatar, login, getMyInfo,
};
