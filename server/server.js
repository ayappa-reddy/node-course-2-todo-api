const express = require('express');
const bodyParser = require('body-parser');

// server.js is responsible for all our routes only.
// require() returns an object in this case module.exports 
// and we can use object dsestructing to 
// store mongoose in the mongoose variable.
const {mongoose, ObjectID} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

let app =express();

// express middelware.
// for custom middleware, we pass a function to app.use()
// for 3rd party middleware, we just defined like below 
// bodyParser.json() returns a function which the express app uses.

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    // body here comes from bodyParser.json()
    // if it's not used, this returns undefined.
    // console.log(req.body);
    let todo = new Todo({
        // req.body.text is here we set it in postman.
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        // todos is an array.
        // it's not good to send an array
        // so we send an object in send with 
        // {todos: todos}, (to be more flexible) where todos is an array
        res.send({todos})
    }, (e) => {
        res.status(400).send(e);
    });
});

//:id is a url parameter, it creates an id variable on the req object.
app.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};