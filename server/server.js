var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('../db/TodoApp');
var {Todo} = require('../models/Todos');
var {User} = require('../models/Users');

var app = express();

//set up the middle-ware
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var myNewTodo = new Todo({
     text: req.body.text
    });

  myNewTodo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.listen(3000 , () => {
  console.log('Server started on port 3000');
});

module.exports = {
  app
}
