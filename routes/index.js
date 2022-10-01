const express = require('express');

const routes = express.Router();
const { userRoutes } = require('./users');
const { cardRoutes } = require('./cards');

routes.use('/users', userRoutes);
routes.use('/cards', cardRoutes);
routes.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

module.exports = {
  routes,
};
