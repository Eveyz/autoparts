import React, { useState, useEffect } from 'react'
import Header from '../layouts/Header'
import { findOrders } from '../order/order_actions'
import Loading from '../layouts/Loading'
import { stats, yearToCurrent } from '../utils'
import M from 'materialize-css'
import MonthlyReport from './MonthlyReport'
import CompanyOrder from './CompanyOrder'

const CurrentMonthOrders = (props) => {

    const [orders, setOrders] = useState([])
    const [year, setYear] = useState((new Date()).getFullYear())
    const [month, setMonth] = useState(String((new Date()).getMonth() + 1).padStart(2, '0'))

    useEffect(() => {
			M.AutoInit()
    }, [])

		const selectYear = (e) => {
			setYear(e.target.value)
			props.changeYear(e.target.value)
		}

		const selectMonth = (e) => {
			setMonth(e.target.value)
			props.changeMonth(e.target.value)
		}

		const years = yearToCurrent().map((y, idx) => {
			return <option key={idx} value={y}>{y}年</option>
		})

		const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((m, idx) => {
			return <option key={idx} value={m}>{m}月</option>
		})

		var sum = 0, own = 0, profit = 0, cnt = 0
    var _orders = props.orders.map((order, idx) => {
			if(!order.cancel) cnt += 1
      if(!order.cancel) sum += order.amount
      if(!order.cancel) profit += order.profit
      if(order.payMethod === "赊账" && !order.paid && !order.cancel) own += order.amount
      return <CompanyOrder key={idx} reOrder={props.reOrder} cancelOrder={props.cancelOrder} order={order} payDebt={props.payDebt} />
    })

    return (
				<>
					<div className="card no-margin">
						<div className="card-content">
							<div className="row no-margin">
								<div className="input-field col s6 m6">
									<select 
										defaultValue={`${year}`} 
										onChange={selectYear}
									>
										{years}
									</select>
									<label>选择年份</label>
								</div>
								<div className="input-field col s6 m6">
									<select 
										defaultValue={`${month}`} 
										onChange={selectMonth}
									>
										{months}
									</select>
									<label>选择年份</label>
								</div>
							</div>
							{
								props.orders.length > 0 ?
								<div>
									<h6>本月订单数: <span>{cnt.toFixed(2)}</span>单</h6>
									<h6>本月已付: <span className="green-text">{(sum - own).toFixed(2)}</span>元</h6>
									<h6>本月赊账: <span className={own > 0 ? "red-text" : ""}>{own.toFixed(2)}</span>元</h6>
									<h6>本月总额: {sum.toFixed(2)}元</h6>
									<h6>利润: <span className="green-text">{profit.toFixed(2)}</span>元</h6>
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
								</div>
								:
								<h5 className="center">没有订单</h5>
							}
						</div>
					</div>
					<br/>
					<br/>
			</>
    )
}

export default CurrentMonthOrders