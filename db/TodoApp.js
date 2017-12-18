var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', {
  useMongoClient: true //needed in the latest version of Mongoose
});

module.exports = {
  mongoose
}
