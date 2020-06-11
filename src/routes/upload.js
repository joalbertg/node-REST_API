const express = require('express');
const fileUpload = require('express-fileupload');
const mkdirp = require('mkdirp');

const {
  badRequest,
  serverError,
  getYYYYMMddHHmmss
} = require('../helpers');
const app = express();

// default options
app.use(fileUpload());
//app.use(fileUpload({ useTempFiles: true }));

const validFile = req => {
  return req.files && Object.keys(req.files).length != 0;
}

const validKinds = kind => {
  return ['users', 'products'].includes(kind);
}

const validExtensions = extension => {
  return ['png', 'jpg', 'gif', 'jpeg'].includes(extension);
}

app.put('/upload/:kind/:id', (req, res) => {
  if (!validFile(req)) return badRequest(null, res, 'No files were uploaded.');

  const { kind, id } = req.params;
  const baseURI = `${__dirname}/../../uploads/${kind}`;
  // The name of the input field (i.e. "file")
  // is used to retrieve the uploaded file
  const file = req.files.file;
  const extension = file.name.split('.').pop();

  if (!validKinds(kind)) return badRequest(null, res, 'Kind not allowed');
  if (!validExtensions(extension)) return badRequest(null, res, 'Format not allowed');

  const newName = `${getYYYYMMddHHmmss()}.${extension}`;

  mkdirp(`${baseURI}/${id}`)
    .then(() => {
      // Use the mv() method to place the file somewhere on your server
      file.mv(`${baseURI}/${id}/${newName}`, error => {
        if (error) return serverError(error, res);

        res.json({
          ok: true,
          message: 'File uploaded!'
        });
      });
    })
    .catch(error => badRequest(error, res));
});

module.exports = app;

