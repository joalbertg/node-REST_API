const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models');
const { TOKEN_EXPIRES_IN, SECRET_SEED_TOKEN } = require('../config');

const app = express();

const badRequest = (error, res, message) => {
  res.status(400).json({
    ok: false,
    error: message ? { message } : error
  });
}

const generateToken = body => jwt.sign(
  body,
  SECRET_SEED_TOKEN,
  { expiresIn: Number(TOKEN_EXPIRES_IN) }
);

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email }, (error, userDB) => {
    if (error) return badRequest(error, res);
    if (!userDB) return badRequest(error, res, 'Incorrect User or Password');

    if (!bcrypt.compareSync(password, userDB.password))
      return badRequest(error, res, 'Incorrect User or Password');

    res.json({
      ok: true,
      user: userDB.name,
      token: generateToken({ user: userDB })
    });
  });
});

module.exports = app;

