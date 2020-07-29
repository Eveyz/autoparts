const Datastore = require('nedb')

var Users = new Datastore({filename: './data/users.db', autoload: true});

console.log("db users loaded")

module.exports = Users;