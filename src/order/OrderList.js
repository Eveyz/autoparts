import React from 'react'

class OrderList extends React.Component {
  constructor(props) {
    super(props)

    this.click = this.click.bind(this)
  }

  click = (id) => (e) => {
    this.props.history.replace(`/orders/${id}`)
  }

  render() {
    const { data } = this.props
    var totalProfit = 0
    const ordersTable = data.length > 0 ?
    <table>
      <thead>
        <tr>
          <th>订单号</th>
          <th>订单日期</th>
          <th>付款方式</th>
          <th>利润(元)</th>
        </tr>
      </thead>

      <tbody>
        {
          data.map((order, idx) => {
            if(!order.cancel) {
              totalProfit += order.profit ? order.profit : 0
              return  <tr key={idx} className="clickable" onClick={this.click(order._id)}>
                        <td className="black-text" style={{fontWeight: "500"}}>{order.orderNum ? order.orderNum : order._id}</td>
                        <td className="black-text" style={{fontWeight: "500"}}>{order.date}</td>
                        <td className={order.payMethod === "赊账" ? "red-text" : ""} style={{fontWeight: "500"}}>{order.payMethod}</td>
                        <td className={order.profit > 0 ? "green-text" : "red-text"}>{order.profit ? order.profit.toFixed(2) : 0}</td>
                      </tr>
            } else {
              return  <tr key={idx} className="clickable" onClick={this.click(order._id)}>
                        <td className="grey-text">{order.orderNum ? order.orderNum : order._id}(退货)</td>
                        <td className="grey-text">{order.date}</td>
                        <td className="grey-text">{order.payMethod}</td>
                        <td className="grey-text">{order.profit ? order.profit.toFixed(2) : 0}</td>
                      </tr>
            }
          })
        }
      </tbody>
    </table>
    :
    <div className="card no-margin">
      <div className="card-content">
        <h5 className="center">当前没有订单</h5>
      </div>
    </div>

    return(
      <div className="container">
        <br/>
        <h5>当页总利润: <span className={totalProfit > 0 ? "green-text" : "red-text"}>{totalProfit ? totalProfit.toFixed(2) : 0}</span>元</h5>
        <h5>所有订单</h5>
        {ordersTable}
      </div>
    )
  }
}

export default OrderList