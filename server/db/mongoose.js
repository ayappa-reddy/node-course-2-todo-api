const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');

mongoose.Promise = global.Promise;
let db = {
    localhost: 'mongodb://localhost:27017/TodoApp',
    mlab: 'mongodb://ayappa:Dxkillo619@ds149268.mlab.com:49268/todoapp'
};
mongoose.connect(process.env.PORT ? db.localhost : db.mlab);

module.exports = {mongoose, ObjectID};