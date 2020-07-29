import React, { useState, useEffect } from 'react'

import Loading from '../layouts/Loading'
import PaginationContainer from '../layouts/PaginationContainer'
import { paginateOrders, countOrders } from './order_actions'
import OrderList from './OrderList'
import { SERACH_ORDERS } from '../constants'

const { ipcRenderer } = window.require("electron")

const OrderListPagination = (props) => {

  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [count, setCount] = useState(0)

  useEffect(() => {
    countOrders({}, (err, count) => {
      setCount(count)
      paginateOrders({}, 0, 30, (err, orders) => {
        setOrders(orders)
        setIsLoading(false)
      })
    })
  }, [])

  const search = (e) => {
    var searchVal = e.target.value.trim()
    const _orders = ipcRenderer.sendSync(SERACH_ORDERS, searchVal)
    setOrders(_orders)
  }

  const getCurrentPageData = (skip) => {
    paginateOrders({}, skip, 30, (err, orders) => {
      setOrders(orders)
    })
  }

  return  <div>
            {
              isLoading ? 
              <Loading/> : 
              <div>
                <br/>
                <div className="container">
                  <div className="row no-margin">
                    <div className="col s12 no-padding no-margin">
                      <input
                        type="text" 
                        placeholder="搜索订单"
                        onChange={search}
                      />
                    </div>
                  </div>
                </div>
                <PaginationContainer 
                  itemsPerPage={30} 
                  data={orders}
                  total={count} 
                  readOnly={true}
                  getCurrentPageData={getCurrentPageData}
                >
                  <OrderList history={props.history} />
                </PaginationContainer>
              </div>
            }
          </div>
}
export default OrderListPagination