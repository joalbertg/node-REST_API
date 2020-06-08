const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT, APPLICATION_NAME, MONGO_URI } = require('../config');

//const PORT = 8080;
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.use(require('../routes').app);

app.get('/', function (req, res) {
  res.json('Hello World');
});

mongoose.connect(`${MONGO_URI}/mydb`,
  { useNewUrlParser: true , useUnifiedTopology: true }, error => {
    if (error) throw error.message;
    console.info('DB Online!!');
  });

app.listen(PORT, () => console.log(
`App: ${APPLICATION_NAME}
Listening in PORT ${PORT}`
));

