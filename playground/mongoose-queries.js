const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

const id = "5aabbdd46fc4ce29ec441a08";
// below id doesn't exist in collection, but still works
// the below methods return null or an empty array.
//const id = "6aabbdd46fc4ce29ec441a08";
//invalid objectid.
// const id = "5aabbdd46fc4ce29ec441a081111";

// //isValid checks if the id is valid or not, alt to catch() at the end.
if(!ObjectID.isValid(id)) {
    console.log('ID not valid');
}

//mongoose will convert id to objectID.
// no need to make a new instance of ObjectID
// like we did before in mongodb querying
//find returns all matching documents in an array
Todo.find({
    _id: id
}).then((todos) => {
    console.log('Todos', todos);
});

//findOne returns the first matching document only, as opposed 
// to an array of documents.
Todo.findOne({
   _id: id
}).then((todo) => {
    console.log('Todo', todo);
});

Todo.findById(id).then((todo) => {
    //if id does not exist inside the collection
    // this method returns null and !null is true
    if (!todo) {
        return console.log('Id not found');
    }
    console.log('Todo by id', todo);
}).catch((e) => console.log(e)); // to catch invalid id.

// User.findById("5aab82972ec7f0244c5038e8").then((user) => {
//     if(!user) {
//         return console.log('User not found');
//     }
//     console.log(JSON.stringify(user, undefined, 2));
// }, (e) => {
//     console.log(e);
// });
