require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

// server.js is responsible for all our routes only.
// require() returns an object in this case module.exports 
// and we can use object dsestructing to 
// store mongoose in the mongoose variable.
const {mongoose, ObjectID} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

let app = express();
// port for heroku
const port = process.env.PORT;

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

        // equivalent to {todo: todo}
        res.send({todo});
    // Below is the reason for using if(!todo) above
    // catch is not redundant here, because it is 
    // capable of handling network connection errors or any other
    // potential errors.
    // and does not return an error, if the doc is simply unavailable.
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // findByIdAndRemove still succeeds(returns null) 
    // even if there is no doc(todo)
    // that's why we check with if(!todo).
    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }

        // equivalent to {todo: todo}
        res.send({todo});
    }).catch((e) => res.status(400).send());
});

// PATCH route helps to update a doc partially,
// whereas put updates it completely. But these are just general
// guidelines.

app.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    //reason for lodash. We do this to ensure that
    //the users do not update fields we don't want them to(like completedAt)
    //or the fields that are just not there at all in monggose model.
    // _.pick takes an object as an argument, pulls off only
    //the items specified in the array in the second argument
    // and stores it in body, which is an object.
    let body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    //if body.completed is a boolean and it is also true.
    if (_.isBoolean(body.completed) && body.completed) {
        //completedAt is set only when completed is true,
        //else we set it to null.
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        //when we want to remove a value from db, we set it 
        //equal to null. 
        body.completedAt = null;
    }

    // similar to findOneAndUpdate in mongodb
    // needs update validators like $set: {}
    // we have already generated an object, body above for
    // $set, new is equivalent to returnOriginal
    // new:true returns the updated doc.
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {app};