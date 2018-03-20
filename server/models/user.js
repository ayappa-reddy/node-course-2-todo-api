// no need to import mongoose from mongoose.js here.
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      // validator: (value) => {
      //     return validator.isEmail(value);
      // },
      message: "{VALUE} is not a valid email"
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

//In addition to creating a method like generateAuthToken, we can also
//override a method like the toJSON method to change the way mongoose handles this method.
//This method enables us to send what we want(_id, email), when mongoose converts the model into json
//limit the data that is sent to the user
//we only send the _is and the email to the user.
UserSchema.methods.toJSON = function () {
    let user = this;
    //to convert into an object.
    let userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

//Instance methods. Using normal function, since we need the 'this' keyword
// to access the document.
UserSchema.methods.generateAuthToken = function () {
    //'this' refers to the particular document on which this method is called.
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    //not using push because of problems with some mongodb versions.
    //users.tokens.push({access, token});
    user.tokens = user.tokens.concat([{access, token}]);

    //this returns the token(promise) when this method is called in server.js
    return user.save().then(() => {
        //we return token here, so that we can tack on 'then' in server.js
        return token;
    });
}

let User = mongoose.model('User', UserSchema);

module.exports = {User};