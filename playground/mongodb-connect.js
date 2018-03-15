// const MongoClient = require('mongodb').MongoClient;
//using destructuring. equivalent to code above
//inaddition to pulling off ObjectID.
const {MongoClient, ObjectID} = require('mongodb');

//creating a new instance of ObjectID
// let obj = new ObjectID();
// console.log(obj);

//object destructuring to pull out values from object
// let user = {name: 'ayappa', age: 25};
// let {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        // using return here instead of else to stop function
        // execution. Just an alternative to using else.
        return console.log('Unable to connect to MongoDB server');
    };
    console.log('Connected to MongoDB server');

    const db = client.db('TodoApp');
    
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert todo', err);
    //     }
           // if things go well
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //     name: 'Ayappa',
    //     age: 22,
    //     location: 'Chennai'
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert user', err);
    //     }

    //     // console.log(JSON.stringify(result.ops, undefined, 2));
    //     console.log(result.ops[0]._id.getTimestamp());
    // });
    
    client.close();
});