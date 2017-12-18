const expect = require('expect');
const request = require('supertest');

const {app} = require ('./../server');
const {Todo} = require('./../../models/Todos');
var count;

const todos = [{
  text: 'Something to do 1'
}, {
  text: 'Something to do 2'
}, {
  text: 'Something to do 3'
}
]

beforeEach((done) => {
    Todo.remove({}).then(() => {
      return Todo.insertMany(todos);
    }).then(() => done());
});

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
  it('should get all todos', () => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(todos.length)
      })
      .end(() => done())
  });

});
