const express = require('express');
const _ = require('underscore');

const { Product } = require('../models');
const { badRequest, serverError } = require('../helpers');
const { AuthMiddleware } = require('../middlewares');

const app = express();
const base = '/products';

app.get(base, (req, res) => {
  const from = Number(req.query.from) || 0;
  const limit = Number(req.query.limit) || 5;

  const opts = {
    available: true
  };

  Product
    .find(opts)
    .populate('user', 'name email')
    .populate('category', 'description')
    .skip(from)
    .limit(limit)
    .exec((error, productDB) => {
      if (error) return badRequest(error, res);

      Product.countDocuments(opts, (error, count) => {
        res.json({
          count,
          product: productDB
        });
      });
    });
});

app.get(`${base}/:id`, (req, res) => {
  const { id } = req.params;

  Product.findById(id)
    .populate('user', 'name email')
    .populate('category', 'description')
    .exec((error, productDB) => {
      if (error) return serverError(error, res);
      if (!productDB) return badRequest(error, res, `Product with id ${id} not found`);

      res.json({ product: productDB });
    });
});

app.post(base, AuthMiddleware, (req, res) => {
  const {
    name,
    unitPrice,
    description,
    available,
    category
  } = req.body;
  const user = req.user;

  const product = new Product({
    name,
    unitPrice,
    description,
    available,
    category,
    user: user._id
  });

  product.save((error, productDB) => {
    if (error) return serverError(error, res);
    if (!productDB) return badRequest(error, res);

    res.status(201).json({
      ok: true,
      product: productDB
    });
  });
});

app.put(`${base}/:id`, AuthMiddleware, (req, res) => {
  const id = req.params.id;
  const body = _.pick(
    req.body, ['name', 'unitPrice', 'description', 'available', 'category']
  );

  Product.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, productDB) => {
    if (error) return serverError(error, res);

    res.json({
      ok:  true,
      product: productDB
    });
  });
});

app.delete(`${base}/:id`, AuthMiddleware, (req, res) => {
  const id = req.params.id;
  const flag = req.body.flag;

  if (flag) {
    Product.findByIdAndRemove(id, (error, productOld) => {
      if (error) return serverError(error, res);
      if (!productOld) return badRequest(error, res, 'Category not found');

      res.json({
        ok: true,
        product: productOld
      });
    });
  } else {
    Product.findByIdAndUpdate(id, { available: false }, { new: true }, (error, productOld) => {
      if (error) return serverError(error, res);

      res.json({
        ok: true,
        product: productOld
      });
    });
  }
});


module.exports = app;

