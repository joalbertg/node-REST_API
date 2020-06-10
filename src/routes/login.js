const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const uuid = require("uuid");

const { User } = require('../models');
const {
  TOKEN_EXPIRES_IN,
  SECRET_SEED_TOKEN,
  CLIENT_ID
} = require('../config');

const client = new OAuth2Client(CLIENT_ID);
const app = express();

const badRequest = (error, res, message) =>
  res.status(400).json(responseBody(error, message));

const serverError = (error, res, message) =>
  res.status(500).json(responseBody(error, message));

const forbiddenRequest = (error, res, message) =>
  res.status(403).json(responseBody(error, message));

const responseBody = (error, message) => ({
  ok: false,
  error: message ? { message } : error
});

const generateToken = body => jwt.sign(
  body,
  SECRET_SEED_TOKEN,
  { expiresIn: Number(TOKEN_EXPIRES_IN) }
);

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email }, (error, userDB) => {
    if (error) return serverError(error, res);
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

// Google config
const verify = async token => {
  const ticket = await client.verifyIdToken({
      idToken: token,
      // Specify the CLIENT_ID of the app that accesses the backend
      audience: CLIENT_ID,
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const { name, email, picture: img } = ticket.getPayload();
  return { name, email, img, google: true };
}

app.post('/google', async (req, res) => {
  const token = req.body.idtoken;
  const googleUser = await verify(token)
    .catch(error => forbiddenRequest(error, res));

  User.findOne({ email: googleUser.email }, (error, userDB) => {
    if (error) return serverError(error, res);

    if (userDB) {
      if (!userDB.google) {
        return badRequest(error, res, 'Use your normal authentication');
      } else {
        res.json({
          ok: true,
          user: userDB,
          token: generateToken({ user: userDB })
        });
      }
    } else {
      // if the user does not exist in the database.
      const user = new User({
        name: googleUser.name,
        email: googleUser.email,
        img: googleUser.img,
        google: true,
        password: uuid.v4()
      });

      user.save((error, userDB) => {
        if (error) return serverError(error, res);

        res.json({
          ok: true,
          user: userDB,
          token: generateToken({ user: userDB })
        });
      });
    }
  });
});

module.exports = app;

