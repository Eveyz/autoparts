import React from 'react'
import M from 'materialize-css'

import Header from '../layouts/Header'
import CartList from './CartList'
import OrderInfoForm from './OrderInfo'
import { generateOrderNum } from '../utils'
import { getToday } from '../utils'
import { createOrder, countOrder } from '../order/order_actions'
import { decreasePartQuantity } from '../Brand/part_actions'
import { createLog } from '../log/log_actions'
import { findOrCreateCompany } from '../company/company_actions'
import { GET_STORE_DATA, UPDATE_PART_FROM_CART, DELETE_PART_FROM_CART, EMPTY_CART } from '../constants'

const { ipcRenderer } = window.require("electron")

class CartListContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      cart: [],
      company: {}
    }

    this.changeQuanlity = this.changeQuanlity.bind(this)
    this.removePartFromCart = this.removePartFromCart.bind(this)
    this.submitOrder = this.submitOrder.bind(this)
  }

  componentDidMount() {
    M.AutoInit()
    const data = ipcRenderer.sendSync(GET_STORE_DATA, "cart")
    this.setState((prevState, props) => ({
      cart: data
    }))
  }

  changeQuanlity(id, cartQuantity, cartSalePrice) {
    const data = ipcRenderer.sendSync(UPDATE_PART_FROM_CART, {
      _id: id,
      cartQuantity: cartQuantity,
      cartSalePrice: cartSalePrice
    })
    this.setState((prevState, props) => ({
      cart: data
    }))
  }

  removePartFromCart(id, cartSalePrice) {
    const data = ipcRenderer.sendSync(DELETE_PART_FROM_CART, {
      id: id,
      cartSalePrice: cartSalePrice
    })
    this.setState((prevState, props) => ({
      cart: data
    }))
  }

  submitOrder = async (o) => {
    const { cart } = this.state
    var profit = 0, sum = 0
    cart.forEach(part => {
      sum += part.cartSalePrice * part.cartQuantity
      profit += (part.cartSalePrice - part.importPrice) * part.cartQuantity
    })

    // check if company exist
    var c = {}
    if(o.company || o.address || o.phone) {
      c = await findOrCreateCompany(o)
    }
    const orderCount = await countOrder()
    
    var d = new Date()
    const { company_id, ...rest } = o
    const order = {
      ...rest,
      parts: this.state.cart,
      paid: o.payMethod === "赊账" ? false : true,
      amount: sum,
      date: getToday(),
      time: d.getTime(),
      profit: profit,
      orderNum: generateOrderNum(orderCount),
      company_id: c._id
    }
    createOrder(order, (err, _order) => {
      if(err) console.log(err)
      _order.parts.forEach(p => {
        decreasePartQuantity(p._id, -1 * p.cartQuantity)
        createLog({
          part_id: p._id,
          part_name: p.name,
          part_brand: p.brand,
          date: getToday(),
          time: d.getTime(),
          type: "out",
          sum: sum,
          quantity: p.cartQuantity,
          price: p.cartSalePrice
        }, (err, log) => {
          if(err) console.log(err)
        })

      })
      ipcRenderer.sendSync(EMPTY_CART, {})
      this.props.history.replace(`/orders/${_order._id}/print`)
    })
  }

  render() {
    const { cart } = this.state

    var sum = 0, quantity = 0
    if(cart.length > 0) {
      cart.forEach(c => {
        quantity += c.cartQuantity
        sum += c.cartSalePrice * c.cartQuantity
      })
    }

    const content = cart.length > 0 ?
    <CartList 
      readOnly={false}
      cart={cart} 
      changeQuanlity={this.changeQuanlity}
      removePartFromCart={this.removePartFromCart}
    /> : 
    <h4 className="center">购物车为空</h4>

    return(
      <div>
        <Header />
        <div className="container">
          <h4>配件列表</h4>
          <div className="card no-margin">
            <div className="card-content">
              {content}
            </div>
          </div>
          <br/>
          <h4>其他信息</h4>
          <OrderInfoForm 
            sum={sum} 
            quantity={quantity}
            submitOrder={this.submitOrder}
          />
        </div>
      </div>
    )
  }
}

export default CartListContainer