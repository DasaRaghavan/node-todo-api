const {MongoClient, ObjectID} = require('mongodb');
var obj = ObjectID();
console.log(obj.getTimestamp());

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const myDb = db.db('TodoApp');

  myDb.collection('Users').find().count().then((count) =>{
    console.log(`Users count: ${count}`);
  }, (err) => {
    console.log(`Unable to fetch count from Todos, ${err}`);
  });
  //
  var collection = myDb.collection('Users');
  collection.find({name: 'Dasa'}).toArray().then((doc) =>{
    console.log(JSON.stringify(doc, undefined, 2));
  }, (err) => {
    console.log(`Unable to fetch count from Users, ${err}`);
  });

  collection.find({
              _id: new ObjectID('5a32eef3283e0942b78ae668')
            })
      .toArray()
      .then((doc) =>{
        console.log(JSON.stringify(doc, undefined, 2));
      }, (err) => {
            console.log(`Unable to fetch count from Users, ${err}`);
          });

  db.close();
});
