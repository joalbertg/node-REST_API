const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const {
  PORT,
  DB_URI,
  APPLICATION_NAME,
  MONGO_OPTS
} = require('../config');

const app = express();

app.use(express.static(__dirname + '/../public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(require('../routes'));

app.get('/', function (req, res) {
  res.json('Hello World');
});

mongoose
  .connect(DB_URI, MONGO_OPTS)
  .then(() => {
    console.info('DB Online!!!');
    app.listen(PORT, () => {
      console.log(`App: ${APPLICATION_NAME}`);
      console.log(`Listening in PORT ${PORT}`);
    });
  })
  .catch(console.error);

