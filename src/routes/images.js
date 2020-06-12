const express = require('express');
const fs = require('fs');
const path = require('path');

const { AuthImgMiddleware } = require('../middlewares');

const app = express();

app.get('/image/:kind/:img', AuthImgMiddleware, (req, res) => {
  const { kind, img } = req.params;
  const productID = req.query.id;
  let id = null;

  if (kind === 'users') {
    id = req.user._id;
  } else if (productID) {
    id = productID;
  }

  const pathImg = path.resolve(__dirname, `../../uploads/${kind}/${id}/${img}`);

  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    const noImagePath = path.resolve(__dirname, '../public/assets/imgs/no-image.jpg');

    //sendFile needs absolute path
    //i.e: /myapp/src/assets/imgs/no-image.jpg
    res.sendFile(noImagePath);
  }
});

module.exports = app;

