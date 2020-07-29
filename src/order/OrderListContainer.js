import React from 'react'

import Header from '../layouts/Header'
import OrderListPagination from './OrderListPagination'

const OrderListContainer = (props) => {
  return  <div>
            <Header />
            <OrderListPagination history={props.history} />
          </div>
}
export default OrderListContainer