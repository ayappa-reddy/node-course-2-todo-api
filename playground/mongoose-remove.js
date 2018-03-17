const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

//to remove everything from collection, it does not return the docs. 
// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// removes first matching doc with the argument and returns the doc
// Todo.findOneAndRemove({ _id: '5aacf0fb952d536dc35f5e6d'}).then((todo) => {

// });

// removes the document with id and returns the doc or
// returns null if no doc
Todo.findByIdAndRemove('5aacf0fb952d536dc35f5e6d').then((doc) => {
    console.log(doc);
});