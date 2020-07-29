import React from 'react'

import CompanyOrder from './CompanyOrder'

class MonthlyReport extends React.Component {
  constructor(props) {
    super(props)

    this.payDebt = this.payDebt.bind(this)
    this.reOrder = this.reOrder.bind(this)
    this.cancelOrder = this.cancelOrder.bind(this)
  }

  payDebt() {
    this.props.payDebt()
  }

  reOrder() {
    this.props.reOrder()
  }

  cancelOrder() {
    this.props.cancelOrder()
  }

  render() {
    var sum = 0, own = 0
    const _orders = this.props.orders.map((order, idx) => {
      if(!order.cancel) sum += order.amount
      if(order.payMethod === "赊账" && !order.paid && !order.cancel) own += order.amount
      return <CompanyOrder key={idx} reOrder={this.reOrder} cancelOrder={this.cancelOrder} order={order} payDebt={this.payDebt} />
    })

    return(
      <li>
        <div className="collapsible-header">
          <div style={{width: "33.3%"}}>月份: {this.props.month}</div>
          <div style={{width: "33.3%"}}>订单数量: {this.props.orders.length}</div>
          <div style={{width: "33.3%"}}>所有订单总额: {sum.toFixed(2)}元</div>
        </div>
        <div className="collapsible-body">
          <h5>本月已付: <span className="green-text">{(sum - own).toFixed(2)}</span>元</h5>
          <h5>本月赊账: <span className={own > 0 ? "red-text" : ""}>{own.toFixed(2)}</span>元</h5>
          <h5>本月总额: {sum.toFixed(2)}元</h5>
          {
            <table>
              <thead>
                <tr>
                  <td>订单号</td>
                  <td>订单金额(元)</td>
                  <td>支付方式</td>
                  <td colSpan="2"></td>
                </tr>
              </thead>
              <tbody>
                {_orders}
              </tbody>
            </table>
          }
        </div>
      </li>
    )
  }
}

export default MonthlyReport