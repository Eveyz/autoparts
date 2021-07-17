const { remote } = window.require("electron")
const db = remote.getGlobal('db')

export const findProfits = (query, callback) => {
  db.profits.find(query, (err, profits) => {
    if(err) console.log(err)
    callback(err, profits)
  })
}

export const findProfit = (id, callback) => {
  db.profits.findOne({_id: id}, (err, profit) => {
    if(err) console.log(err)
    callback(err, profit)
  })
}

export const createProfit = (profit, callback) => {
  db.profits.insert(profit, (err, _profit) => {
    if(err) console.log(err)
    callback(err, _profit)
  })
}

export const createProfits = (profits, callback) => {
    db.profits.insert(profits, (err) => {
      if(err) console.log(err)
    })
}

export const updateProfit = (id, profit, callback) => {
  db.profits.update({_id: id}, {$set: profit}, (err, num) => {
    if(err) console.error(err)
    callback(err, num)
  })
}

export const removeProfit = (id, callback) => {
  db.profits.remove({ _id: id}, {}, (err, numRemoved) => {
    if(err) console.log(err)
    callback(err, numRemoved)
  });
}
