const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const {
  PORT,
  APPLICATION_NAME,
  MONGO_URI,
  MONGO_OPTS
} = require('../config');

//const PORT = 8080;
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.use(require('../routes').userRoutes);

app.get('/', function (req, res) {
  res.json('Hello World');
});

mongoose
  .connect(`${MONGO_URI}/mydb`, MONGO_OPTS)
  .then(() => {
    console.info('DB Online!!!');
    app.listen(PORT, () => {
      console.log(`App: ${APPLICATION_NAME}`);
      console.log(`Listening in PORT ${PORT}`);
    });
  })
  .catch(console.error);

