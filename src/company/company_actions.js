const { remote } = window.require("electron")
const db = remote.getGlobal('db')

export const findCompanies = (query, callback) => {
  db.companies.find(query, (err, companies) => {
    if(err) console.log(err)
    callback(err, companies.sort((a, b) => {
      return b.time - a.time
    }))
  })
}

export const countCompanies = (query, callback) => {
  db.companies.count(query, function (err, count) {
    callback(err, count)
  })
}

export const paginateCompanies = (query, skip, limit, callback) => {
  db.companies.find(query).skip(skip).limit(limit).exec(function (err, companies) {
    callback(err, companies)
  })
}

export const regexFindCompanies = (query, callback) => {
  db.companies.find(query, (err, companies) => {
    if(err) console.log(err)
    callback(err, companies.sort((a, b) => {
      return b.time - a.time
    }))
  })
}

export const findCompany = (query, callback) => {
  db.companies.findOne(query, (err, company) => {
    if(err) console.log(err)
    callback(err, company)
  })
}

export const findOrCreateCompany = async (_company) => {
  return new Promise(resolve => {
    db.companies.findOne({_id: _company.company_id}, (err, c) => {
      if(err) console.log(err)
      if(c) {
        resolve(c)
      } else {
        const { company, company_id, personnel, payMethod, ...rest } = _company
        db.companies.insert({...rest, name: company }, (err, c) => {
          if(err) console.log(err)
          resolve(c)
        })
      }
    })
  })
}

export const findCompanyOrders = (id, callback) => {
  db.orders.find({company_id: id}, (err, orders) => {
    if(err) console.log(err)
    callback(err, orders.sort((a, b) => {
      return b.time - a.time
    }))
  })
}

export const createCompany = (company, callback) => {
  db.companies.insert(company, (err, _company) => {
    if(err) console.log(err)
    callback(err, _company)
  })
}

export const updateCompany = (id, company, callback) => {
  db.companies.update({_id: id}, {$set: company}, (err, num) => {
    if(err) console.error(err)
    callback(err, num)
  })
}

export const removeCompany = (id, callback) => {
  db.companies.remove({ _id: id}, {}, (err, numRemoved) => {
    if(err) console.log(err)
    callback(err, numRemoved)
  })
}