require('./config/config');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('../db/TodoApp');
var {Todo} = require('../models/Todos');
var {User} = require('../models/Users');
var {authenticate} = require('./../middleware/authenticate');

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
  // console.log("IM here inside get");
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

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;

  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});

//User.findByToken
//user.generateAuthToken


app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])
  var myNewuser = new User(body);

  myNewuser.save().then(() => {
    return myNewuser.generateAuthToken();
  }).then((token)=>{
    //res.header('x-auth',token).send({email: myNewuser.email, password: myNewuser.password});
    res.header('x-auth',token).send(myNewuser);
  }).catch((e) => {
    res.status(401).send();
  })
});

//TL;DR

app.post('/users/login', (req,res) => {
  var body = _.pick(req.body, ['email', 'password']);
  // res.send(body); << this works >>

  // As a user, when I login from a new device and provide my
  // user id and valid password, a new auth token must be generated


  // receive user id
  // check if user id exists
  // compare password supplied and encrypted password in collection
  // if the comparison succeeds, return the jsonwebtoken as an auth on the headers
  // if comparison fails, return error

  // create a model method on Users.js to perform the tasks listed above
  // pass the credentials to the method and get the promise as a response
  User.findByCredentials(body.email, body.password).then((user) => {

    //generate a new authentication token for the device
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    }).catch((e)=>res.send(e));

  }).catch((e)=>{
    res.status(400).send(e)
  });

});
//TL;DR

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
})

app.listen(port , () => {
  console.log(`Server started on ${port}`);
});

module.exports = {
  app
}
