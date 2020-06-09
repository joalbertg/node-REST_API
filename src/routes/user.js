const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const { User } = require('../models');

const app = express();

const badRequest = (error, res, message) => {
  res.status(400).json({
    ok: false,
    error: message ? { message } : error
  });
}

app.get('/users', function (req, res) {
  const from = Number(req.query.from) || 0;
  const limit = Number(req.query.limit) || 5;

  const opts = { status: true };

  User
    .find(opts, 'name email role status google img')
    .skip(from)
    .limit(limit)
    .exec((error, usersDB) => {
      if (error) return badRequest(error, res);

      User.count(opts, (error, count) => {
        res.json({
          count,
          users: usersDB
        });
      } );
    });
});

app.get('/users/:id', function (req, res) {
  const { id } = req.params;

  User.findById(id, (error, userDB) => {
    if (error || !userDB) return badRequest(error, res, `User with id ${id} not found`);

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
    if (error) return badRequest(error, res);

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
    if (error) return badRequest(error, res);

    res.json({
      ok:  true,
      user: userDB
    });
  });
});

app.delete('/users/:id', function (req, res) {
  const id = req.params.id;
  const flag = req.body.flag;

  if (flag) {
    User.findByIdAndRemove(id, (error, userOld) => {
      if (error) return badRequest(error, res);
      if (!userOld) return badRequest(error, res, 'User not found');

      res.json({
        ok: true,
        user: userOld
      });
    });
  } else {
    User.findByIdAndUpdate(id, { status: false }, { new: true }, (error, userOld) => {
      if (error) return badRequest(error, res);

      res.json({
        ok: true,
        user: userOld
      });
    });
  }
});

module.exports = app;

