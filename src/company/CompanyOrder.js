import React from 'react'
import { Link } from 'react-router-dom'

import { getToday } from '../utils'
import { createLog } from '../log/log_actions'
import { updateOrder } from '../order/order_actions'
import { updatePartStorage } from '../Brand/part_actions'

class CompanyOrder extends React.Component {
  constructor(props) {
    super(props)

    this.payDebt = this.payDebt.bind(this)
    this.reOrder = this.reOrder.bind(this)
    this.cancelOrder = this.cancelOrder.bind(this)
  }

  payDebt() {
    updateOrder(this.props.order._id, {paid: true}, (err) => {
      if(err) console.log(err)
      
      this.props.payDebt()
    })
  }

  reOrder() {
    updateOrder(this.props.order._id, {cancel: false}, (err) => {
      if(err) console.log(err)
      this.props.reOrder()
    })
  }

  cancelOrder(order) {
    updateOrder(this.props.order._id, {cancel: true}, (err) => {
      if(err) console.log(err)
      this.props.cancelOrder()
      order.parts.forEach((part, idx) => {
        // create logs
        var d = new Date()
        createLog({
          part_id: part._id,
          part_name: part.name,
          part_brand: part.brand,
          date: getToday(),
          time: d.getTime(),
          type: "in",
          quantity: part.cartQuantity,
          price: part.cartSalePrice
        }, (err, log) => {
          if(err) console.log(err)
        })

        updatePartStorage(part._id, part.cartQuantity, (err) => {
          if(err) console.log(err)
        })
      })
    })
  }

  render() {
    const { order } = this.props
    if(order.cancel) {
      return(
        <tr>
          <td><Link to={`/orders/${order._id}`} replace>{order.orderNum}</Link></td>
          <td className="grey-text lighten-3"><strike>{order.amount ? order.amount.toFixed(2) : 0}</strike></td>
          <td className="grey-text lighten-3"><strike>{order.payMethod}</strike></td>
          <td></td>
          <td>
            <button className="btn" disabled>已退单</button>
          </td>
        </tr>
      )
    }

    return(
      <tr>
        <td><Link to={`/orders/${order._id}`} replace>{order.orderNum}</Link></td>
        <td className="black-text">{order.amount ? order.amount.toFixed(2) : 0}</td>
        <td className={order.payMethod === "赊账" ? "red-text" : "green-text"} style={{fontWeight: "500"}}>{order.payMethod}</td>
        <td>
          {
            order.payMethod === "赊账" && !order.cancel ? 
            order.paid ? <button className="btn" disabled><span className="green-text">&#10004;</span> 已付清</button> : <button className="btn" onClick={() => {
              if(window.confirm('确认订单已支付?')) { 
                this.payDebt()
              }
            }}>付清</button>
            : ""
          }
        </td>
        <td>
          <button className="btn red" onClick={() => {
            if(window.confirm('确认退此订单?')) { 
              this.cancelOrder(order)
            }
          }}>退单</button>
        </td>
      </tr>
    )
  }
}

export default CompanyOrder