const bcrypt = require('bcrypt-nodejs');
const { remote } = window.require("electron")
const db = remote.getGlobal('db')

export const findUsers = (query, callback) => {
  db.users.find(query, (err, _users) => {
    if(err) console.log(err)
    callback(err, _users)
  })
}

export const createUser = (user, callback) => {
  user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
  db.users.insert(user, (err, _user) => {
    if(err) {
      console.log(err)
      callback(err)
    }
    callback(err, { error: false, user: _user })
  })
}

export const authenticate = (user, callback) => {
  db.users.findOne({username: user.username}, (err, _user) => {
    if(!_user) {
      callback(err, {
        'autenticated': false,
        'msg': '账号错误'
      })
      return
    }
    bcrypt.compare(user.password, _user.password, (err, isMatch) => {
      if(err) console.error(err);
      if(!isMatch) {
        callback(err, {
          'autenticated': false,
          'msg': '密码错误'
        })
        return
      } else {
        callback(err, {
          'autenticated': true,
          'user': _user
        })
        return
      }
    });
  })
}