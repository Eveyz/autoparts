import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import CompanyOrders from './CompanyOrders'
import { findCompany, findCompanyOrders } from './company_actions'
import { findOrders } from '../order/order_actions'
import Loading from '../layouts/Loading'
import { groupByMonth } from '../utils'

const Company = (props) => {

    const [isLoading, setLoading] = useState(true)
    const [company, setCompany] = useState(null)
    const [orders, setOrders] = useState([])
    const [year, setYear] = useState(String((new Date()).getFullYear()))
    const [month, setMonth] = useState(String((new Date()).getMonth() + 1).padStart(2, '0'))


  const fetchComanyData = () => {
    setLoading(true)
    findCompany({_id: props.match.params._id}, (err, company) => {
      // findCompanyOrders(company._id, (err, orders) => {
      //   var _orders = groupByMonth(orders)
      //   p.setState((prevState, props) => ({
      //     isLoading: false,
      //     company: company,
      //     orders: _orders
      //   }))
      // })

      findOrders({company_id: company._id, 'date': { $gt: `${year}.${month}` }}, (err, _orders) => {
        setCompany(company)
        setOrders(_orders)
        setLoading(false)
      })
    })
  }

  const changeYear = (y) => {
    findOrders({company_id: company._id, 'date': { $gt: `${y}.${month}` }}, (err, _orders) => {
      setLoading(false)
      setOrders(_orders)
      setYear(y)
    })
  }

  const changeMonth = (m) => {
    findOrders({company_id: company._id, 'date': { $gt: `${year}.${m}`, $lt: `${year}.${String(parseInt(m) + 1).padStart(2, '0')}`}}, (err, _orders) => {
      setLoading(false)
      setOrders(_orders)
      setMonth(m)
    })
  }

  useEffect(() => {
    setLoading(true)
    findCompany({_id: props.match.params._id}, (err, company) => {
      findOrders({company_id: company._id, 'date': { $gt: `${year}.${month}` }}, (err, _orders) => {
        setCompany(company)
        setOrders(_orders)
        setLoading(false)
      })
    })
  }, [])

  const cancelOrder = () => {
    fetchComanyData()
  }

  const reOrder = () => {
    fetchComanyData()
  }

  const payDebt = () => {
    fetchComanyData()
  }

  return (
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
          <CompanyOrders orders={orders} changeYear={changeYear} changeMonth={changeMonth} cancelOrder={cancelOrder} payDebt={payDebt} reOrder={reOrder} />
        </div>
      }
    </div>
  )
}

export default Company