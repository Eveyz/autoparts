const {
  app, 
  BrowserWindow, 
  ipcMain,
  shell
} = require('electron')
const path = require('path')
const url = require('url')

const fs = require('fs')
const os = require('os')

const Datastore = require('nedb')

var _db = {}
_db.users = new Datastore({ filename: path.join(app.getPath("userData"), "users.db"), autoload: true })
_db.parts = new Datastore({ filename: path.join(app.getPath("userData"), "parts.db"), autoload: true })
_db.orders = new Datastore({ filename: path.join(app.getPath("userData"), "orders.db"), autoload: true })
_db.logs = new Datastore({ filename: path.join(app.getPath("userData"), "logs.db"), autoload: true })
_db.companies = new Datastore({ filename: path.join(app.getPath("userData"), "companies.db"), autoload: true })
_db.counts = new Datastore({ filename: path.join(app.getPath("userData"), "counts.db"), autoload: true })
_db.profit = new Datastore({ filename: path.join(app.getPath("userData"), "profit.db"), autoload: true })

// _db.users.loadDatabase()
// _db.parts.loadDatabase()

_db.parts.ensureIndex({ fieldName: 'brand' })
_db.orders.ensureIndex({ fieldName: 'time' })
_db.orders.ensureIndex({ fieldName: 'year' })

const {
  GET_STORE,
  GET_STORE_DATA,
  LOGIN_USER,
  IS_AUTHENTICATE,
  IS_AUTHENTICATE_REPLY,
  GET_TOYATA_DATA,
  GET_TOYATA_DATA_REPLY,
  EMPTY_CART,
  PRINT_TO_PDF,
  SERACH_PARTS,
  ADD_PART_TO_CART,
  UPDATE_PART_FROM_CART,
  DELETE_PART_FROM_CART,
  BROADCAST_CART_TO_COMPONENT,
  SERACH_ORDERS
} = require('./src/constants')

var store = {
  authenticate: false,
  cart: []
}

// global variables
global.db = _db
global.store = store

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let workerWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../app.asar/build/index.html'),
    protocol: 'file:',
    slashes: true
  });

  if (process.platform === 'darwin') {
    mainWindow.loadURL("http://localhost:3000")
  } else {
    mainWindow.loadURL(startUrl)
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    workerWindow.close()
    workerWindow = null
    mainWindow = null
  })

  workerWindow = new BrowserWindow({
    width: 1200,
    height: 900
  })
  workerWindow.loadURL("file://" + __dirname + "/worker.html")
  workerWindow.hide()
  // workerWindow.webContents.openDevTools()
  workerWindow.on("closed", () => {
    workerWindow = null
  });
}

// ------ ipc communication ----------

ipcMain.on(LOGIN_USER, (event, isAuthenticated) => {
  store.authenticate = isAuthenticated
})

ipcMain.on(IS_AUTHENTICATE, (event, data) => {
  event.sender.send(IS_AUTHENTICATE_REPLY, store.authenticate)
})

ipcMain.on(GET_STORE_DATA, (event, field) => {
  event.returnValue = store[field]
})

ipcMain.on(SERACH_PARTS, (event, query) => {
  // [brand, field, value]
  _db.parts.find({
    "brand": query[0],
    [query[1]]: {$regex: new RegExp(query[2])}
  }, (err, parts) => {
    if(err) console.log(err)
    event.returnValue = parts
  })
})

ipcMain.on(GET_TOYATA_DATA, (event, arg) => {
  event.returnValue = []
})

ipcMain.on(ADD_PART_TO_CART, (event, part) => {
  var exist = false
  store.cart.forEach((c, idx) => {
    if(part._id === c._id && part.cartSalePrice === c.cartSalePrice) {
      c.cartQuantity += part.cartQuantity
      exist = true
    }
  })
  if(!exist) store.cart = [...store.cart, part]
  mainWindow.webContents.send(BROADCAST_CART_TO_COMPONENT, {cart: store.cart})
  event.returnValue = {}
})

ipcMain.on(UPDATE_PART_FROM_CART, (event, part) => {
  store.cart = store.cart.map(c => {
    if(c._id === part._id && c.cartSalePrice === part.cartSalePrice) {
      c["cartQuantity"] = part["cartQuantity"]
    }
    return c
  })
  mainWindow.webContents.send(BROADCAST_CART_TO_COMPONENT, {cart: store.cart})
  event.returnValue = store.cart
})

ipcMain.on(DELETE_PART_FROM_CART, (event, part) => {
  store.cart = store.cart.filter(c => (c._id !== part.id || c.cartSalePrice !== part.cartSalePrice))
  mainWindow.webContents.send(BROADCAST_CART_TO_COMPONENT, {cart: store.cart})
  event.returnValue = store.cart
})

ipcMain.on(EMPTY_CART, (event, arg) => {
  store.cart = []
  mainWindow.webContents.send(BROADCAST_CART_TO_COMPONENT, {cart: store.cart})
  event.returnValue = store.cart
})

ipcMain.on("printPDF", (event, content) => {
  workerWindow.webContents.send("printPDF", content)
  event.returnValue = null
});

// when worker window is ready
ipcMain.on("readyToPrintPDF", (event) => {
  const pdfPath = path.join(os.tmpdir(), 'print.pdf');
  // Use default printing options
  workerWindow.webContents.print()
  // const options = { silent: true }
  // workerWindow.webContents.print(options, (success, errorType) => {
  //   if (!success) console.log(errorType)
  // })
  // workerWindow.webContents.printToPDF({}, function (error, data) {
  //   if (error) throw error
  //   fs.writeFile(pdfPath, data, function (error) {
  //     if (error) {
  //       throw error
  //     }
  //     shell.openItem(pdfPath)
  //     event.sender.send('wrote-pdf', pdfPath)
  //   })
  // })
});

ipcMain.on(SERACH_ORDERS, (event, orderNum) => {
  // [brand, field, value]
  _db.orders.find({
    "orderNum": {$regex: new RegExp(orderNum)}
  }, (err, orders) => {
    if(err) console.log(err)
    event.returnValue = orders.sort((a, b) => {
      return b.time - a.time
    })
  })
})

// ------ end ------

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

app.on('will-quit', function() { 
  if (process.platform != 'darwin') 
    app.quit()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})