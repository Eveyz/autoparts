const Datastore = require('nedb')

var db = {};
db.users = new Datastore({filename: './data/users.db', autoload: true});
db.parts = new Datastore({filename: './data/parts.db', autoload: true});

db.users.loadDatabase();
db.parts.loadDatabase();

module.exports = db;