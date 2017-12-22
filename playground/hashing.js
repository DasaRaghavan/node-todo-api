const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'abc12345';

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   })
// })

var hashedPassword = '$2a$10$65Esfjf3r43sJv71OZjLKu5NPuAd0YJ3tdh3qm9s2.D/rhGCUVz3e';
bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
})


//jwt.sign('data to be tokenised', 'secret') << salt the secret >>
//jwt.verify('token to be validated', 'salted secret')
//
// var secret = SHA256('dashfam1ly').toString();
// var data = {
//   id: 10
// };
//
// console.log(`secret: ${secret}`);
// var token = jwt.sign(data, secret);
// console.log(`token: ${token}`);
//
// var decoded = jwt.verify(token, secret);
// console.log(JSON.stringify(decoded, undefined, 2));
//
// var someFunction = function(a,b) {
//   var value = this
//   return value;
// }
//
// console.log(someFunction);
