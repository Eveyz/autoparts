import React from 'react'
import { Link } from 'react-router-dom'

import CompanyOrders from './CompanyOrders'
import { findCompany, findCompanyOrders } from './company_actions'
import Loading from '../layouts/Loading'
import { groupByMonth } from '../utils'

class Company extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      company: null,
      orders: {}
    }

    this.cancelOrder = this.cancelOrder.bind(this)
    this.reOrder = this.reOrder.bind(this)
    this.payDebt = this.payDebt.bind(this)
    this.fetchComanyData = this.fetchComanyData.bind(this)
  }

  fetchComanyData() {
    var p = this
    findCompany({_id: this.props.match.params._id}, (err, company) => {
      findCompanyOrders(company._id, (err, orders) => {
        var _orders = groupByMonth(orders)
        p.setState((prevState, props) => ({
          isLoading: false,
          company: company,
          orders: _orders
        }))
      })
    })
  }

  componentDidMount() {
    this.fetchComanyData()
  }

  cancelOrder() {
    this.fetchComanyData()
  }

  reOrder() {
    this.fetchComanyData()
  }

  payDebt() {
    this.fetchComanyData()
  }

  render() {
    var { isLoading, company, orders } = this.state
    return(
      <div className="container">
        <br/>
        {
          isLoading ? <Loading /> 
          : 
          <div>
            <Link to={"/companies"} replace><button className="btn white black-text">返回</button></Link>
            <br/>
            <br/>
            <h5 style={{marginTop: "0px"}}>单位信息</h5>
            <div className="card no-margin">
              <div className="card-content">
                <table>
                  <thead>
                    <tr>
                      <td>单位名</td>
                      <td>单位地址</td>
                      <td>单位电话</td>
                      <td>开户银行及账号</td>
                      <td>税号</td>
                      <td>发票号</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{company.name}</td>
                      <td>{company.address}</td>
                      <td>{company.phone}</td>
                      <td>{company.bank}</td>
                      <td>{company.tax}</td>
                      <td>{company.receipt}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <br/>
            <CompanyOrders orders={orders} cancelOrder={this.cancelOrder} payDebt={this.payDebt} reOrder={this.reOrder} />
          </div>
        }
      </div>
    )
  }
}

export default Company