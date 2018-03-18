const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');

// we do this to ensure that beforeEach after removing
// all todos, inserts these below todos with insertMany
// which takes an array as an argument

// adding seed(test) data, so that our database is still predictable.
const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
}];

// testing lifecycle method 'beforeEach' lets you run some code
// before running any test cases below. This is done to setup the database
// before testing cause currently there might be other todos
// making todos.length to not be 1 exactly.
// the test cases are executed only when we call done() at the end.
beforeEach((done) => {
    //remove({}) with empty object removes all todos from mongodb.
    //Todo.remove({}).then(() => done());
    Todo.remove({}).then(() => {
        //return is used, so we can tack on another then
        return Todo.insertMany(todos);
    }).then(() => done());
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

                //find({text}) returns only one todo here
                // because it only matches the text defined above
                // so the length will still be 1
                Todo.find({text}).then((todos) => {
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
                    // since this block doesn't add any new todos,
                    // the length only remains 2 because the todos
                    // array, we added up above only has two objects
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            }).end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            // to convert an ObjectID to a string, we use
            // toHexString().
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return a 404 if todo not found', (done) => {
        // creates a new id, not present in todos array above
        let hexId = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos:/id', () => {
    it('should remove a todo', (done) => {
        //id for 2nd item in todos above.
        let hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                // res.body.todo becuase we send
                // res.send({todo}); in server.js
                expect(res.body.todo._id).toBe(hexId);
            })
            //doing some async tests to check if the todo
            //is actually removed from the database.
            .end((err, res) => {
                if (err) {
                    // done(err) lets mocha render the error
                    return done(err);
                }

                //we are expecting null, if doc with id is removed
                //from the database.
                Todo.findById(hexId).then((todo) => {
                    // expect(null).toNotExist();
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404 if todo not found', (done) => {
        let hexId = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done);  
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        let hexId = todos[0]._id.toHexString();
        let text = "Patch First test todo";
        let completed = true;

        request(app)
            .patch(`/todos/${hexId}`)
            .send({text, completed})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA("number");
            })
            // we could also test for invalid id's and if a todo exists in the 
            // database like we did above for other routes.
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        let hexId = todos[1]._id.toHexString();
        let text = "Patch Second test todo";
        let completed = false;

        request(app)
            .patch(`/todos/${hexId}`)
            .send({text, completed})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });
});