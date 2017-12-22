const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

  var UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      minlength: 1,
      trim: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email',
        isAsync: false
      }
    },
    password: {
      type: String,
      require: true,
      minlength: 6
    },
    tokens: [{
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }]

  },
  {
    usePushEach: true // needed for this version of Mongoose
  });



  UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    //console.log(_.pick(userObject, ['_id', 'email']));
    return _.pick(userObject, ['_id', 'email']);
  };

  // instance methods have access to the individual document from MongoDB
  // the arrow function is not used here.
  // arrow functions do not bind the "this" keyword to a variable

  UserSchema.methods.generateAuthToken = function() {
    var user = this; // the this keyword stores the MongoDB user document
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    // user.tokens = user.tokens.concat({access, token});
    // << see comment on usePushEach >>
    user.tokens.push({access, token});

    return user.save().then(() => {
      return token;
    });
  }

  UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try{
      decoded = jwt.verify(token, 'abc123');
    } catch(e) {
        return Promise.reject(e);
    }

    return User.findOne({
      '_id': decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    });
  }

  UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;

    return User.findOne({email}).then((user) => {
      if(!user) {
        return Promise.reject();
      }
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
          if(res){
            console.log(res);
              resolve(user);
          } else {
              reject();
          }
        });
      });
    })
  };


  UserSchema.pre('save', function(next) {
    var user = this;
    // check if password was modified
    // hash the password only when the user object is modified
    if (user.isModified('password')){
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash;
          next();
        });
      });
    } else {
       next(); // this is required to allow the code to proceed when the password is not modified
    }
  });

var User = mongoose.model('User', UserSchema);

module.exports = {
  User
}
