const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const myDb = db.db('TodoApp');
  var collection = myDb.collection('Users');

  collection.findOneAndUpdate({//filpter
    name: 'someName',
    location: 'someLocation'
  },
    {//condition
      $set: { location: 'Apex' }
    },
    { returnOriginal: true }).then((result) => {
      console.log(JSON.stringify(result, undefined, 2));
  }, (err) => {
    console.log(JSON.stringify(err, undefined, 2));
  });




  // db.close();
});
