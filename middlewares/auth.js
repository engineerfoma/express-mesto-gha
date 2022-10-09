const jwt = require('jsonwebtoken');
const { Authorization } = require('../errors/authorization-err');

const auth = async (req, res, next) => {
  const token = req.cookie.jwt;
  let payload;

  try {
    payload = await jwt.verify(token, 'SECRET');
  } catch (e) {
    return next(new Authorization('Ошибка авторизации'));
  }
  req.user = payload;
  return next();
};

module.exports = {
  auth,
};
