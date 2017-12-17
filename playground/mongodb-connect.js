const {MongoClient, ObjectID} = require('mongodb');
var obj = ObjectID();
console.log(obj.getTimestamp());

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const myDb = db.db('TodoApp');
  // myDb.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: 'False'
  // }, (err, results) => {
  //   if(err) {
  //     console.log('Unable to insert todo', err);
  //   }
  //     console.log(JSON.stringify(results.ops, undefined, 2));
  //
  // });


  myDb.collection('Users').insertOne({
    name: 'someName',
    age: 50,
    location: 'someLocation'
  }, (err, results) => {
    if (err) {
      return console.log('Unable to insert user', err);
    }
    console.log(JSON.stringify(results.ops[0]._id.getTimestamp()));
    console.log(JSON.stringify(results.ops, undefined, 2));
  });

  db.close();
});
