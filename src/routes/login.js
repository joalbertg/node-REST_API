const express = require('express');
const bcrypt = require('bcrypt');

const { User } = require('../models');

const app = express();

const badRequest = (error, res, message) => {
  res.status(400).json({
    ok: false,
    error: message ? { message } : error
  });
}

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
      token: '123abc'
    });
  });
});

module.exports = app;

