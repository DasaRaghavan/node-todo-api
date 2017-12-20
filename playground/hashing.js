const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');


//jwt.sign('data to be tokenised', 'secret') << salt the secret >>
//jwt.verify('token to be validated', 'salted secret')

var secret = SHA256('dashfam1ly').toString();
var data = {
  id: 10
};

console.log(`secret: ${secret}`);
var token = jwt.sign(data, secret);
console.log(`token: ${token}`);

var decoded = jwt.verify(token, secret);
console.log(JSON.stringify(decoded, undefined, 2));

var someFunction = function(a,b) {
  var value = this
  return value;
}

console.log(someFunction);
