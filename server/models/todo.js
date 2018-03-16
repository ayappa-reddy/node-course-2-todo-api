// no need to import mongoose from mongoose.js here.
const mongoose = require('mongoose');

let Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        // avoids empty string
        minlength: 1,
        // removes leading and trailing whitespaces ('   ') => ('');
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    // with default:null, completedAt won't exist if the 
    // user has not completed a todo
    completedAt: {
        type: Number,
        default: null
    }
});

module.exports = {Todo};
