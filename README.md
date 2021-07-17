yarn install

windows db path: C://Users/XXX/AppData/Roaming/autoparts/

Dev:
npm run start
npm run electron-dev


Mac
app.getpath: /Users/znz/Library/Application Support/autoparts

Schema:
    Company:
        address: ""
        bank: ""
        name: "启恒汽修厂"
        phone: ""
        receipt: ""
        tax: ""
        time: 1561706446612
        _id: "xKF6qyWv0keSelpl"
    
    order:
        address: ""
        amount: 210
        bank: ""
        company: "启恒汽修厂"
        company_id: "xKF6qyWv0keSelpl"
        date: "2021.07.16"
        orderNum: "#0000001830"
        paid: true
        parts: Array(1)
        payMethod: "现金"
        personnel: ""
        phone: ""
        profit: 22
        receipt: ""
        tax: ""
        time: 1626396325492
        _id: "cSWCi2ymMgvVia2e"

    part:
        brand: "nissan"
        carType: "J32"
        cartQuantity: 1
        cartSalePrice: 105
        importPrice: 83
        name: "雨刮片"
        number: ""
        order: "26+J32"
        quantity: 2
        salePrice: 105
        unit: "支"
        _id: "2bgFNztl1IPSG3Hi"