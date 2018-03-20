const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

// let message = "I am user number 3";
// //SHA256() returns an object
// let hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// let data = {
//     id: 4
// };

// let token = {
//     data,
//     //salting the hash('somesecret') by adding something unique to the hash.
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// // //USER MODIFYING VALUES HERE TO TRICK
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
// // //But since they do not know the secret salt value which is only on the server, 
// // //they won't succeed. 

// let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash) {
//     // data is not manipulated
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed. Do not trust!' );
// }

let data = {
    id: 10
};

//jwt.sign takes the data obj and the secret salt value and returns the token
//which we will send to the user.
let token = jwt.sign(data, '123abc');
console.log(token);

//is verified only if the token and the secret passed is the same(123abc)
//if it's changed anywhere before, jwt throws an error.
let decoded = jwt.verify(token, '123abc');
console.log('decoded', decoded);

