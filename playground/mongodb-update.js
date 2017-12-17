const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const myDb = db.db('TodoApp');

  var collectionTodos = myDb.collection('Todos');
  var collection = myDb.collection('Users');

  collectionTodos.findOneAndUpdate({//filter
      _id: ObjectID('5a367ee9eaf99930b52d197e'),
    }, {//set
      $set: {
        completed: true
      }
    }, {
      returnOriginal: false
    }).then((result) => {
      console.log(JSON.stringify(result, undefined, 2));
    }, (err) => {
      console.log(`Error: ${err}`);
    });

  collection.findOneAndUpdate({//filter
    name: 'someName',
    _id: ObjectID("5a368043b4ea2b30d50275b1"),
    location: 'Apex'
  },
    {//condition
      $set: { location: 'Apex' },
      $inc: { age : 10, daysInField: 3 } // age incremented by 10 to 60, DIF by 3 to 5

    },
    { returnNewDocument: true }).then((result) => {
      console.log(JSON.stringify(result, undefined, 2));
  }, (err) => {
    console.log(JSON.stringify(err, undefined, 2));
  });




  // db.close();
});
