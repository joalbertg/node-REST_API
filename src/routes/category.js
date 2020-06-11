const express = require('express');
const _ = require('underscore');

const { Category } = require('../models');
const { badRequest, serverError } = require('../helpers');
const { AuthMiddleware, AdminRoleMiddleware } = require('../middlewares');

const app = express();
const base = '/categories';

app.get(base, (req, res) => {
  const from = Number(req.query.from) || 0;
  const limit = Number(req.query.limit) || 5;

  Category
    .find({})
    .sort('description')
    .populate('user', 'name email')
    .skip(from)
    .limit(limit)
    .exec((error, categoriesDB) => {
      if (error) return badRequest(error, res);

      Category.countDocuments({}, (error, count) => {
        res.json({
          count,
          categories: categoriesDB
        });
      });
    });
});

app.get(`${base}/:id`, (req, res) => {
  const { id } = req.params;

  Category.findById(id, (error, categoryDB) => {
    if (error) return serverError(error, res);
    if (!categoryDB) return badRequest(error, res, `Category with id ${id} not found`);

    res.json({ category: categoryDB });
  });
});

app.post(base, AuthMiddleware, (req, res) => {
  const { description } = req.body;
  const user = req.user;

  const category = new Category({
    description,
    user: user._id
  });

  category.save((error, categoryDB) => {
    if (error) return serverError(error, res);
    if (!categoryDB) return badRequest(error, res);

    res.json({
      ok: true,
      category: categoryDB
    });
  });
});

app.put(`${base}/:id`, AuthMiddleware, (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['description']);

  Category.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, categoryDB) => {
    if (error) return serverError(error, res);

    res.json({
      ok:  true,
      category: categoryDB
    });
  });
});

app.delete(`${base}/:id`, [AuthMiddleware, AdminRoleMiddleware], (req, res) => {
  const id = req.params.id;

  Category.findByIdAndRemove(id, (error, categoryOld) => {
    if (error) return serverError(error, res);
    if (!categoryOld) return badRequest(error, res, 'Category not found');

    res.json({
      ok: true,
      category: categoryOld
    });
  });
});

module.exports = app;

