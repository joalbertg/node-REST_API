const jwt = require('jsonwebtoken');

const { SECRET_SEED_TOKEN } = require('../config');

const unauthorizedRequest = (error, res, message) => {
  res.status(401).json({
    ok: false,
    error: message ? { message } : error
  });
}

const verifyToken = (req, res, next) => {
  // const token = req.headers['authorization'];
  const token = req.get('token');

  jwt.verify(token, SECRET_SEED_TOKEN, (error, decoded) => {
    if (error) return unauthorizedRequest(error, res);

    req.user = decoded.user;
    next();
  });
}

module.exports = verifyToken;

