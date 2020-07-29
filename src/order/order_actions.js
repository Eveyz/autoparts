const { remote } = window.require("electron")
const db = remote.getGlobal('db')

export const findOrders = (query, callback) => {
  db.orders.find(query, (err, orders) => {
    if(err) console.log(err)
    callback(err, orders.sort((a, b) => {
      return b.time - a.time
    }))
  })
}

export const countOrders = (query, callback) => {
  db.orders.count(query, function (err, count) {
    callback(err, count)
  })
}

export const paginateOrders = (query, skip, limit, callback) => {
  db.orders.find(query).sort({ time: -1 }).skip(skip).limit(limit).exec(function (err, orders) {
    callback(err, orders)
  })
}

export const regexFindOrders = (query, callback) => {
  db.orders.find(query, (err, orders) => {
    if(err) console.log(err)
    callback(err, orders.sort((a, b) => {
      return b.time - a.time
    }))
  })
}

export const findOrder = (id, callback) => {
  db.orders.findOne({_id: id}, (err, order) => {
    if(err) console.log(err)
    callback(err, order)
  })
}

export const createOrder = (order, callback) => {
  db.orders.insert(order, (err, _order) => {
    if(err) console.log(err)
    callback(err, _order)
  })
}

export const updateOrder = (id, order, callback) => {
  db.orders.update({_id: id}, {$set: order}, (err, num) => {
    if(err) console.error(err)
    callback(err, num)
  })
}

export const removeOrder = (id, callback) => {
  db.orders.remove({ _id: id}, {}, (err, numRemoved) => {
    if(err) console.log(err)
    callback(err, numRemoved)
  });
}

export const countOrder = () => {
  return new Promise(resolve => {
    db.orders.count({}, (err, count) => {
      resolve(count)
    })
  })
}