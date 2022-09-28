const User = require('../models/User');

const createUser = (req, res) => {
  const user = new User(req.body).save();
  res.status(200).send(user);
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    if(!user) {
      return res.status(401).send({message: 'Пошёл нахуй'});
    }
    const user = await User.findById(id);
    return res.status(200).send(user);
  } catch (e) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const updateUserProfile = async (req, res) => {
  const { id } = req.user._id;
  // try {
  //   if(!user) {
  //     return res.status(401).send({message: 'Пошёл нахуй'});
  //   }
  //   const user = await User.findById(id);
  //   return res.status(200).send(user);
  // } catch (e) {
  //   res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  // }
};

const updateUserAvatar = async (req, res) => {
  const { id } = req.user._id;
  // try {
  //   if(!user) {
  //     return res.status(401).send({message: 'Пошёл нахуй'});
  //   }
  //   const user = await User.findById(id);
  //   return res.status(200).send(user);
  // } catch (e) {
  //   res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  // }
};

module.exports = { createUser, getUsers, getUserById, updateUserProfile, updateUserAvatar };
