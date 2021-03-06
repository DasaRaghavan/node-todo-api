const {Todo} = require('./../../../models/Todos');
const {ObjectID} = require('mongodb');
const {User} = require('./../../../models/Users');
const jwt = require('jsonwebtoken');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();

  const todos = [{
    _id: new ObjectID(),
    text: 'Something to do 1',
    completed: true,
    _createdBy: userOneID
  }, {
    _id: new ObjectID(),
    text: 'Something to do 2',
    _createdBy: userTwoID
  }
  ]

  const users = [{
    _id: userOneID,
    email: 'userOne@example.com',
    password: 'useronepass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneID.toHexString(), access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  }, {
    _id: userTwoID,
    email: 'userTwo@example.com',
    password: 'useronepass'
  }]

  const populateTodos = (done) => {
      Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
      }).then(() => done());
  };

  const populateUsers = (done) => {
    User.remove({}).then(() => {
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();
      return Promise.all([userOne, userTwo]);
    }).then(() => done());
  };

  module.exports = {todos, populateTodos, users, populateUsers};
