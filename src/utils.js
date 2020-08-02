export const brandChinese = {
  "toyota": "丰田",
  "nissan": "日产",
  "mitsubishi": "三凌",
  "honda": "本田"
}

export const getToday = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + '.' + mm + '.' + dd;
  return today
}

function isInt(n) {
  return n % 1 === 0;
}

export const groupBy = (list, keyGetter) => {
  const map = new Map()
  list.forEach((item) => {
    const key = keyGetter(item)
    const collection = map.get(key)
    if (!collection) {
      map.set(key, [item])
    } else {
      collection.push(item)
    }
  })
  return map
}

export const stats = (list) => {
  // profit: { 2020: { 1: 234, 2: 456 } }
  var profit = {},
      parts = {},
      orders = {},
      brands = {}
  list.forEach((item) => {
    var d1 = new Date(item.time),
        m = d1.getMonth() + 1,
        y = d1.getFullYear();

    // profit
    if(profit[y]) {
      if(profit[y][m]) profit[y][m] = profit[y][m] + item.profit
      else profit[y][m] = item.profit
    } else {
      profit[y] = {}
      profit[y][m] = item.profit
    }

    // orders
    let current_year = new Date().getFullYear()
    orders[y] ? orders[y] = orders[y] + 1 : orders[y] = 1
    // end orders

    if(item.parts && item.parts.length > 0) {
      item.parts.forEach((p, idx) => {
        // brands
        if(brands[y]) {
          if(brands[y][brandChinese[p.brand]]) brands[y][brandChinese[p.brand]] = brands[y][brandChinese[p.brand]] + 1
          else brands[y][brandChinese[p.brand]] = 1
        } else {
          brands[y] = {}
          brands[y][brandChinese[p.brand]] = 1
        }
      })
    }
  })
  return {
    "_profit": profit,
    "_parts": parts,
    "_orders": orders,
    "_brands": brands,
  }
}

export const groupByYear = (list) => {
  const map = new Map()
  list.forEach((item) => {
    const keys = item.date.split(".")
    const key = `${keys[0]}}`
    const collection = map.get(key)
    if (!collection) {
      map.set(key, [item])
    } else {
      collection.push(item)
    }
  })
  return map
}

export const groupByMonth = (list) => {
  const map = new Map()
  list.forEach((item) => {
    const keys = item.date.split(".")
    const key = `${keys[0]}/${keys[1]}`
    const collection = map.get(key)
    if (!collection) {
      map.set(key, [item])
    } else {
      collection.push(item)
    }
  })
  return map
}

export const generateOrderNum = (num) => {
  var res = num + 1 + ""
  for(let i = 10 - res.length; i--; ) {
    res = "0" + res
  }
  res = "#" + res
  return res
}

export const toRMBWords = (_amount) => {
  var amount = parseFloat(_amount).toFixed(2)
  var res = "元"
  var map = {
    0: "零",
    1: "壹",
    2: "贰",
    3: "叁",
    4: "肆",
    5: "伍",
    6: "陆",
    7: "柒",
    8: "捌",
    9: "玖",
    10: "拾",
    100: "佰",
    1000: "仟",
    10000: "万",
    100000: "拾万"
  }
  var carry = 1
  var tmp = Math.floor(amount)
  while(tmp >= 1) {
    var digit = map[tmp%10]
    var unit = ""
    tmp = parseInt(tmp/10)
    if(carry > 1) unit = map[carry]
    carry = carry * 10
    if(digit !== "零") {
      res = digit + unit + res
    }
  }

  if(isInt(amount)) {
    res += "正"
  } else {
    var decimal = '' + (amount - Math.floor(amount)).toFixed(2) * 100
    if(decimal[0] !== '0') {
      res = res + map[parseInt(decimal[0])] + "分"
    }
    if(decimal[1] !== '0') {
      res = res + map[parseInt(decimal[1])] + "角"
    }
  }
  return res
}