import React from 'react'
import M from 'materialize-css'
import CurrentMonthOrders from './CurrentMonthOrders'
// import MonthlyReport from './MonthlyReport'

class CompanyOrders extends React.Component {

  componentDidMount() {
    M.AutoInit()
  }

  render() {
    const { orders } = this.props
    // const months = [...orders.keys()]
    // const content = months.length > 0 ? 
    // <ul className="collapsible" data-collapsible="accordion">
    //   {
    //     months.map((month, idx) => {
    //       return  <MonthlyReport key={idx} reOrder={this.props.reOrder} cancelOrder={this.props.cancelOrder} payDebt={this.props.payDebt} month={month} orders={orders.get(month)} />
    //     })
    //   }
    // </ul>
    // : <h5 className="center">没有订单</h5>

    return(
      <div>
        <h5 style={{marginTop: "0px"}}>订单</h5>
        <CurrentMonthOrders changeYear={this.props.changeYear} changeMonth={this.props.changeMonth} orders={orders} reOrder={this.props.reOrder} cancelOrder={this.props.cancelOrder} payDebt={this.props.payDebt} />
      </div>
    )
  }
}

export default CompanyOrders