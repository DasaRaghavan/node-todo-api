const {ObjectID} = require('mongodb');

const {mongoose} = require('./../db/TodoApp');
const {Todo} = require('./../models/Todos');
const {User} = require('./../models/Users');

var id = '5a3733b764d4cb484a0d8cb1';

// User.find({
//   _id: id
// }).then((User) => {
//   return console.log(User);
// }, (e) =>{
//   console.log(e);
// });
//
// User.findOne({
//   _id: id
// }).then((User) => {
//   return console.log(User);
// }, (e) =>{
//   console.log(e);
// });

User.findById(id).then((User) => {
  if(!User) {
    return console.log('Unable to find user');
  }
  return console.log(JSON.stringify(User, undefined, 2));
}, (e) =>{
  console.log(e);
});
