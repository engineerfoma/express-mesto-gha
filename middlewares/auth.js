const jwt = require('jsonwebtoken');
const { AuthorizationError } = require('../errors/authorization-err');

const auth = async (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = await jwt.verify(token, 'qwerty');
  } catch (e) {
    return next(new AuthorizationError('Ошибка авторизации'));
  }
  req.user = payload;
  return next();
};

module.exports = {
  auth,
};
