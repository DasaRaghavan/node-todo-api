const expect = require('expect');
const request = require('supertest');
const {ObjectID} =  require('mongodb');

const {app} = require ('./../server');
const {Todo} = require('./../../models/Todos');
const {User} = require('./../../models/Users');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');
var authToken;

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST Todos', () => {
  it('should create a new Todo', (done) => {
    var text = 'Test Todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      })
  });

  it('should NOT create a new Todo', (done) => {

    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      // .expect((res) => {
      //   expect(res.body.text).toBe(text);
      // })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(todos.length);
          //expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      })
  });

});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(todos.length)
      })
      .end(() => done())
  });

});

describe('/todos/ids', () => {
  it('should get a doc todo', (done) => {
    request(app)
      .get(`todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.text).toBe(todos[0].text)
      })
      .end(()=>done());
  });

  it('should return a 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .get(`todos/${hexId}`)
      .expect(404)
      .end(()=>done());
  });

  it('should return a 404 for non-object ID', (done) => {
    request(app)
      .get(`todos/123`)
      .expect(404)
      .end(()=>done());
  });

});

describe('remove by /todos/:id', () => {
  it('should remove todo by id', (done) => {
    // console.log(todos[1]._id.toHexString());
    var hexID = (todos[1]._id.toHexString());
    request(app)
      .delete(`/todos/${hexID}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexID);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(hexID).then((todo) => {
          expect(todo).toNotExist;
          done();
        }).catch((e)=>done(e));
      })
  });

  it('should return a 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .delete(`todos/${hexId}`)
      .expect(404)
      .end(()=>done());
  });

  it('should return a 404 for non-object ID', (done) => {
    request(app)
      .delete(`todos/123`)
      .expect(404)
      .end(()=>done());
  });
});

describe('update by todo/:id', () => {
  it('should patch a todo based on an id', (done) => {

    var hexID = (todos[2]._id.toHexString());
    var text = 'This is the new text';

    request(app)
      .patch(`/todos/${hexID}`)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        //expect(res.body.todo.completedAt).toBeA('number');
        expect(typeof(res.body.todo.completedAt)).toEqual('number');
      })
      .end(done);
    });

      it('should clear completedAt when completed is not true', (done) => {
        var hexID = (todos[3]._id.toHexString());
        var text = 'This is the new text to see completedAt changed to null';

        request(app)
          .patch(`/todos/${hexID}`)
          .send({
            completed: false,
            text
          })
          .expect(200)
          .expect((res) => {
            // console.log(res.body.todo.text);
            expect(res.body.todo.text).toBe(text);
            // console.log(res.body.todo.completed);
            expect(res.body.todo.completed).toBe(false);
            // console.log(res.body.todo.completedAt);
            expect(res.body.todo.completedAt).toBe(null);
          })
          .end(done);
      });

});

describe('test for /users/me', () => {
  it('should return the user for authenticated users', (done) => {

    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe((users[0]._id).toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should NOT return the user for unauthenticated users', (done) => {

    request(app)
      .get('/users/me')
      // .set('x-auth', users[1].tokens[1].token)
      .expect(401)
      .expect(res => {
        expect(res.body.name).toBe('JsonWebTokenError');
        expect(res.body.message).toBe('jwt must be provided');
      })
      .end(done);
  });

});


  describe(' POST /users', () => {
    it('should create the user', (done) => {
      var email = 'dasaTest1@example.com';
      var password = '123mnb';

      request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toBeTruthy();
          expect(res.body._id).toBeTruthy();
          expect(res.body.email).toBe(email);
        })
        .end((err) => {
          if (err) {
            return done(err);
          }
          User.findOne({email}).then((user) => {
            // expect(user).toBeTruthy();
            expect(user.email).toBe(email);
            expect(user.password).not.toBe(password);
            done();
          });
        });
      })

    it('should result in a validation error, when email format or password length is incorrect', (done) => {
        var email = 'dasaTest1example.com';
        var password = '123mnb';

        request(app)
          .post('/users')
          .send({email, password})
          .expect(401)
          .expect((res) => {
            // expect(res.headers['x-auth']).toBeTruthy();
            expect(res.body.errors).toBeUndefined();
            expect(res.body.name).toBeUndefined();
          })
          .end(done);
        });

    it('should not create the user if email is duplicated', (done) => {
      var email = users[0].email;
      var password = '123mnb';

      request(app)
        .post('/users')
        .send({email, password})
        .expect(401)
        .expect((res) => {
          // expect(res.headers['x-auth']).toBeTruthy();
          expect(res.body.errors).toBeUndefined();
          expect(res.body.name).toBeUndefined();
        })
        .end(done);
      });

  });


  describe('POST /users/login', () => {
  //
    it('should generate a new auth token for an existing user', (done) => {
      var email = users[0].email;
      var password = users[0].password;

      request(app)
        .post('/users/login')
        .send({email, password})
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBeTruthy();
          expect(res.body.email).toBe(users[0].email);
          expect(res.headers['x-auth']).toBeTruthy();
          // console.log(res.headers['x-auth']);
          var hexID = (res.body._id);
          User.findOne(ObjectID(hexID)).then((user)=>{
            //console.log(user.tokens[1].token);
            expect(user.tokens[1].token).toBe(res.headers['x-auth']);
          });
          })
        .end(done);
    });
  //
  //
    it('should return a 401 status for a user that does not exist', (done) => {
      var email = 'emailDoesNotExist@example.com';
      var password = users[0].password;

      request(app)
        .post('/users/login')
        .send({email, password})
        .expect(400)
        .end(done);
    });
  //
    it('should return a 401 status for a user that supplies an incorrect password', (done) => {
      var email = users[0].email;
      var password = "incorrectPassword";

      request(app)
        .post('/users/login')
        .send({email, password})
        .expect(400)
        .end(done);
    });
  //
  });
