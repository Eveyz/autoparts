const Datastore = require('nedb')

var Parts = new Datastore({filename: './data/parts.db', autoload: true});

console.log("db parts loaded")

module.exports = Parts;