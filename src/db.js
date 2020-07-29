const Datastore = require('nedb')

// var userData = app.getAppPath('userData');

// const dbFactory = (fileName) => new Datastore({
//   // filename: `${process.env.NODE_ENV} === 'dev'` ? './data' : `${userData}/data/${fileName}`,
//   filename: `./data/${fileName}`,
//   autoload: true
// })

// const db = {
//   users: dbFactory('users.db'),
//   parts: dbFactory('parts.db')
// }

var db = {};
db.users = new Datastore('./data/users.db');
db.parts = new Datastore('./data/parts.db');

db.users.loadDatabase();
db.parts.loadDatabase();

export default db