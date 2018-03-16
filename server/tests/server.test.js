const expect = require('expect');
const request = require('supertest');

const {app} = require('../server');
const {Todo} = require('../models/todo');

// testing lifecycle method 'beforeEach' lets you run some code
// before running any test cases below. This is done to setup the database
// before testing cause currently there might be other todos
// making todos.length to not be 1 exactly.
// the test cases are executed only when we call done() at the end.
beforeEach((done) => {
    //remove({}) with empty object removes all todos from mongodb.
    Todo.remove({}).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        let text = 'Test todo text';

        // supertest automatically converts the object in send({text}) to json
        request(app)
            .post('/todos')
            .send({text})
            // default expect call
            .expect(200)
            // custom expect calls require a callback and
            // get passed a response.
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            // not passing done to end(), we instaed pass a callback 
            // so that we can check if the todo with 'text' is stored correctly
            // in the database
            .end((err, res) => {
                if (err) {
                    // stops execution if there's an error, alt to else
                    return done(err);
                }

                Todo.find().then((todos) => {
                    // will pass here(refer beforeEach above)
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                // catches all errors.
                }).catch((e) => done(e));
            });
    });

    it('should not create todo with invalid body data', (done) => {

        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
});