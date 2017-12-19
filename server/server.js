const {ObjectID} = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');


var {mongoose} = require('../db/TodoApp');
var {Todo} = require('../models/Todos');
var {User} = require('../models/Users');

var app = express();
const port = process.env.PORT || 3000;

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

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if(!todo) {
      return res.status(404).send('Todo not found');
    } res.send({todo});
  }, (e) => {
    res.status(400).send('Invalid request');
  });

});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo) {
      return res.status(404).send('There There');
    } res.send({todo});
  }, (e) => {
    res.status(400).send();
  });
});

app.listen(port , () => {
  console.log(`Server started on ${port}`);
});

module.exports = {
  app
}
