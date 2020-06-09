const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const { User } = require('../models');

const app = express();

app.get('/users', function (req, res) {
  res.json({users: [
    {id: 123, name: "Joalbert"},
    {id: 321, name: "Lisset"}
  ]});
});

app.get('/users/:id', function (req, res) {
  const { id } = req.params;

  User.findById(id, (error, userDB) => {
    if (error) {
      return res.status(400).json({
        ok: false,
        error
      });
    }

    res.json({ user: userDB });
  });
});

app.post('/users', function (req, res) {
  const { name, email, password, role } = req.body;
  const user = new User({
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    role
  });

  user.save((error, userDB) => {
    if (error) {
      return res.status(400).json({
        ok: false,
        error
      });
    }

    res.json({
      ok: true,
      user: userDB
    });
  });
});

app.put('/users/:id', function (req, res) {
  const id = req.params.id;
  const body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

  User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, userDB) => {
    if (error) {
      return res.status(400).json({
        ok: false,
        error
      });
    }

    res.json({
      ok:  true,
      user: userDB
    });
  });
});

app.delete('/delete', function (req, res) {
  res.json('Hello World');
});

module.exports = app;

