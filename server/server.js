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

app.post('/todos', authenticate, (req, res) => {

  var myNewTodo = new Todo({
     text: req.body.text,
     _createdBy: req.user._id
    });

  myNewTodo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({_createdBy:req.user._id}).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if(!todo) {
      return res.status(404).send('Todo not found1');
    } else if (todo._createdBy.toString() != req.user._id.toString()){
      return res.status(404).send('Todo not found2');
    }
    res.send({todo});
  }, (e) => {
    res.status(400).send('Invalid request');
  });

});

// app.delete('/todos/:id', authenticate, (req, res) => {
//   var id = req.params.id;
//
//   if(!ObjectID.isValid(id)){
//     return res.status(404).send();
//   }
//
//   Todo.findByIdAndRemove(id).then((todo) => {
//     if(!todo) {
//       return res.status(404).send('Todo not found1');
//     } else if (todo._createdBy.toString() != req.user._id.toString()){
//         return res.status(404).send('Todo not found2');
//     }
//     res.send({todo});
//   }, (e) => {
//     res.status(400).send();
//   });
// });

// ***** with async/await
app.delete('/todos/:id', authenticate, async (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  try {
    const todo = await Todo.findByIdAndRemove(id);
      if(!todo) {
        return res.status(404).send('Todo not found1');
      } else if (todo._createdBy.toString() != req.user._id.toString()){
          return res.status(404).send('Todo not found2');
      }
      res.send({todo});
  } catch(e) {
    res.status(400).send();
  }
});



app.patch('/todos/:id', authenticate, (req, res) => {
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
    } else if (todo._createdBy.toString() != req.user._id.toString()){
        return res.status(404).send('Todo not found2');
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});

//User.findByToken
//user.generateAuthToken


// app.post('/users', (req, res) => {
//   var body = _.pick(req.body, ['email', 'password'])
//   var myNewuser = new User(body);
//
//   myNewuser.save().then(() => {
//     return myNewuser.generateAuthToken();
//   }).then((token)=>{
//     //res.header('x-auth',token).send({email: myNewuser.email, password: myNewuser.password});
//     res.header('x-auth',token).send(myNewuser);
//   }).catch((e) => {
//     res.status(401).send();
//   })
// });

//with async/await
app.post('/users', async (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])
  var myNewuser = new User(body);
  try {
    await myNewuser.save();
    const token = await myNewuser.generateAuthToken();
    return res.header('x-auth',token).send(myNewuser);
  } catch (e) {
      res.status(401).send();
  }
});



// app.post('/users/login', (req,res) => {
//   var body = _.pick(req.body, ['email', 'password']);
//   // res.send(body); << this works >>
//
//   // As a user, when I login from a new device and provide my
//   // user id and valid password, a new auth token must be generated
//
//
//   // receive user id
//   // check if user id exists
//   // compare password supplied and encrypted password in collection
//   // if the comparison succeeds, return the jsonwebtoken as an auth on the headers
//   // if comparison fails, return error
//
//   // create a model method on Users.js to perform the tasks listed above
//   // pass the credentials to the method and get the promise as a response
//   User.findByCredentials(body.email, body.password).then((user) => {
//
//     //generate a new authentication token for the device
//     return user.generateAuthToken().then((token) => {
//       res.header('x-auth', token).send(user);
//     }).catch((e)=>res.send(e));
//
//   }).catch((e)=>{
//     res.status(400).send(e)
//   });
//
// });

//with async/await
app.post('/users/login', async (req,res) => {
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

  try {
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    return res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e)
  }
});




app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// users logout: remove token from tokens array for the users

// create a PRIVATE (i.e., authenticated user) route with delete
// by calling authenticate in middleware.
// Calling authenticate will modify the req object to include the token

// app.delete('/users/me/token', authenticate, (req,res) => {
//
//   // console.log(req); << worked. req now contains the token >>
//   // create an instance method 'removeToken' in Users.js
//   req.user.removeToken(req.token).then(() => {
//     res.status(200).send();
//   }, () => {
//     res.send();
//   });
//
// });

// with async/await
app.delete('/users/me/token', authenticate, async (req,res) => {

  // console.log(req); << worked. req now contains the token >>
  // create an instance method 'removeToken' in Users.js
  try {
    await req.user.removeToken(req.token)
    return res.status(200).send();
  } catch (e) {
      res.send();
  }
});

app.listen(port , () => {
  console.log(`Server started on ${port}`);
});

module.exports = {
  app
}
