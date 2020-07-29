const { remote } = window.require("electron")
const db = remote.getGlobal('db')

export const findLogs = (query, callback) => {
  db.logs.find(query, (err, logs) => {
    if(err) console.log(err)
    callback(err, logs.sort((a, b) => {
      return b.time - a.time
    }))
  })
}

export const countLogs = (query, callback) => {
  db.logs.count(query, function (err, count) {
    callback(err, count)
  })
}

export const paginateLogs = (query, skip, limit, callback) => {
  db.logs.find(query).sort({ time: -1 }).skip(skip).limit(limit).exec(function (err, logs) {
    callback(err, logs)
  })
}

export const regexFindLogs = (query, callback) => {
  db.logs.find(query, (err, logs) => {
    if(err) console.log(err)
    callback(err, logs.sort((a, b) => {
      return b.time - a.time
    }))
  })
}

export const findLog = (id, callback) => {
  db.logs.findOne({_id: id}, (err, log) => {
    if(err) console.log(err)
    callback(err, log)
  })
}

export const createLog = (log, callback) => {
  db.logs.insert(log, (err, _log) => {
    if(err) console.log(err)
    callback(err, _log)
  })
}

export const updateLog = (query, log, callback) => {
  db.logs.update(query, {$set: log}, (err, num) => {
    if(err) console.error(err)
    callback(err, num)
  })
}

export const removeLog = (query, callback) => {
  db.logs.remove(query, {}, (err, numRemoved) => {
    if(err) console.log(err)
    callback(err, numRemoved)
  });
}