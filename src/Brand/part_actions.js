const { remote } = window.require("electron")
const db = remote.getGlobal('db')

export const findParts = (query, callback) => {
  db.parts.find(query, (err, parts) => {
    if(err) console.log(err)
    callback(err, parts)
  })
}

export const countParts = (query, callback) => {
  db.parts.count(query, function (err, count) {
    callback(err, count)
  })
}

export const paginateParts = (query, skip, limit, callback) => {
  db.parts.find(query).skip(skip).limit(limit).exec(function (err, parts) {
    callback(err, parts)
  })
}

export const regexFindParts = (query, callback) => {
  db.parts.find(query, (err, parts) => {
    if(err) console.log(err)
    callback(err, parts)
  })
}

export const findPart = (id, callback) => {
  db.parts.findOne({_id: id}, (err, part) => {
    if(err) console.log(err)
    callback(err, part)
  })
}

export const createPart = (part, callback) => {
  db.parts.insert(part, (err, _part) => {
    if(err) console.log(err)
    callback(err, _part)
  })
}

export const decreasePartQuantity = (id, number) => {
  db.parts.update({_id: id}, {$inc: {quantity: number}}, (err, num) => {
    if(err) console.error(err)
  })
}

export const updatePart = (id, part, callback) => {
  db.parts.update({_id: id}, {$set: part}, (err, num) => {
    if(err) console.error(err)
    callback(err, num)
  })
}

export const updatePartStorage = (id, value, callback) => {
  db.parts.update({_id: id}, {$inc: {quantity: value}}, (err, num) => {
    if(err) console.error(err)
    callback(err, num)
  })
}

export const removePart = (id, callback) => {
  db.parts.remove({ _id: id}, {}, (err, numRemoved) => {
    if(err) console.log(err)
    callback(err, numRemoved)
  });
}