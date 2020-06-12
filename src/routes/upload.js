const express = require('express');
const fileUpload = require('express-fileupload');
const mkdirp = require('mkdirp');
const fs = require('fs');

const {
  badRequest,
  serverError,
  getYYYYMMddHHmmss
} = require('../helpers');
const { User, Product } = require('../models');
const app = express();

// default options
app.use(fileUpload());

const validFile = req => {
  return req.files && Object.keys(req.files).length != 0;
}

const validExtensions = extension => {
  return ['png', 'jpg', 'gif', 'jpeg'].includes(extension);
}

app.put('/upload/:kind/:id', (req, res) => {
  if (!validFile(req)) return badRequest(null, res, 'No files were uploaded.');

  const { kind, id } = req.params;
  // The name of the input field (i.e. "file")
  // is used to retrieve the uploaded file
  const file = req.files.file;
  const extension = file.name.split('.').pop();

  if (!validExtensions(extension)) return badRequest(null, res, 'Format not allowed');
  const fileSettings = {
    id,
    kind,
    file,
    name: `${getYYYYMMddHHmmss()}.${extension}`
  };

  switch (kind) {
    case 'users':
      return userImage(fileSettings, res);
    case 'products':
      return productImage(fileSettings, res);
    default:
      return badRequest(null, res, 'Kind not allowed');
  }
});

const createFile = (fileSettings, res) => {
  const { id, kind, file, name } = fileSettings;
  const baseURI = `${__dirname}/../../uploads/${kind}`;

  mkdirp(`${baseURI}/${id}`)
  .then(() => {
    // Use the mv() method to place the file somewhere on your server
    file.mv(`${baseURI}/${id}/${name}`, error => {
      if (error) return serverError(error, res);

      res.json({
        ok: true,
        message: 'File uploaded!'
      });
    });
  })
  .catch(error => badRequest(error, res));
};

const userImage = (fileSettings, res) => {
  User.findById(fileSettings.id, (error, userDB) => {
    if (error) return serverError(error, res);
    if (!userDB) return badRequest(error, res, 'User not found');

    const oldImage = userDB.img;
    userDB.img = fileSettings.name;

    userDB.save(error => {
      if (error) return serverError(error, res);

      deleteOldImage(fileSettings.id, fileSettings.kind, oldImage);
      createFile(fileSettings, res);
    });
  });
};

const productImage = (fileSettings, res) => {
  Product.findById(fileSettings.id, (error, productDB) => {
    if (error) return serverError(error, res);
    if (!productDB) return badRequest(error, res, 'Product not found');

    const oldImage = productDB.img;
    productDB.img = fileSettings.name;

    productDB.save(error => {
      if (error) return serverError(error, res);

      deleteOldImage(fileSettings.id, fileSettings.kind, oldImage);
      createFile(fileSettings, res);
    });
  });
};

const deleteOldImage = (id, kind, imageName) => {
  const path = `${__dirname}/../../uploads/${kind}/${id}/${imageName}`;

  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}

module.exports = app;

