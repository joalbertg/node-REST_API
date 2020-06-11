const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const { User } = require('../models');
const { badRequest, serverError } = require('../helpers');
const { AuthMiddleware, AdminRoleMiddleware } = require('../middlewares');

const app = express();
const base = '/users';

app.get(base, (req, res) => {
  const from = Number(req.query.from) || 0;
  const limit = Number(req.query.limit) || 5;

  const opts = { status: true };

  User
    .find(opts, 'name email role status google img')
    .skip(from)
    .limit(limit)
    .exec((error, usersDB) => {
      if (error) return badRequest(error, res);

      User.countDocuments(opts, (error, count) => {
        res.json({
          count,
          users: usersDB
        });
      } );
    });
});

app.get(`${base}/:id`, (req, res) => {
  const { id } = req.params;

  User.findById(id, (error, userDB) => {
    if (error) return serverError(error, res);
    if (!userDB) return badRequest(error, res, `User with id ${id} not found`);

    res.json({ user: userDB });
  });
});

app.post(base, [AuthMiddleware, AdminRoleMiddleware], (req, res) => {
  const { name, email, password, role } = req.body;
  const user = new User({
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    role
  });

  user.save((error, userDB) => {
    if (error) return serverError(error, res);

    res.json({
      ok: true,
      user: userDB
    });
  });
});

app.put(`${base}/:id`, [AuthMiddleware, AdminRoleMiddleware], (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

  User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, userDB) => {
    if (error) return serverError(error, res);

    res.json({
      ok:  true,
      user: userDB
    });
  });
});

app.delete(`${base}/:id`, [AuthMiddleware, AdminRoleMiddleware], (req, res) => {
  const id = req.params.id;
  const flag = req.body.flag;

  if (flag) {
    User.findByIdAndRemove(id, (error, userOld) => {
      if (error) return serverError(error, res);
      if (!userOld) return badRequest(error, res, 'User not found');

      res.json({
        ok: true,
        user: userOld
      });
    });
  } else {
    User.findByIdAndUpdate(id, { status: false }, { new: true }, (error, userOld) => {
      if (error) return serverError(error, res);

      res.json({
        ok: true,
        user: userOld
      });
    });
  }
});

module.exports = app;

