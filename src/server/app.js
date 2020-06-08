const express = require('express');
const bodyParser = require('body-parser');

const { PORT, APPLICATION_NAME } = require('../config');

//const PORT = 8080;
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.json('Hello World');
});

app.get('/users', function (req, res) {
  res.json({users: [
    {id: 123, name: "Joalbert"},
    {id: 321, name: "Lisset"}
  ]});
});

app.get('/users/:id', function (req, res) {
  const { id } = req.params;
  res.json(`user: ${id}`);
});

app.post('/users', function (req, res) {
  const body = req.body;

  if (body.name) {
    res.json(body);
  } else {
    res.status(400).json({
      cod: 400,
      message: 'Name is empty',
      error: 'send name'
    });
  }
});

app.put('/users/:id', function (req, res) {
  const user = {
    id: 123,
    name: 'Jolabert'
  };
  const { name } = req.body;
  user.name = name;
  res.json(user);
});

app.delete('/delete', function (req, res) {
  res.json('Hello World');
});

app.listen(PORT, () => console.log(
`App: ${APPLICATION_NAME}
Listening in PORT ${PORT}`
));

