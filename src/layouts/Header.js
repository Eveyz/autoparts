import React from 'react'
import { Link } from 'react-router-dom'

import { BROADCAST_CART_TO_COMPONENT, GET_STORE_DATA } from '../constants'

const { ipcRenderer } = window.require("electron")

class Header extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      cart: []
    }
  }

  componentDidMount() {
    const data = ipcRenderer.sendSync(GET_STORE_DATA, "cart")
    this.setState((prevState, props) => ({
      cart: data
    }))
  }

  componentDidUpdate() {
    ipcRenderer.once(BROADCAST_CART_TO_COMPONENT , (event , data) => { 
      this.setState((prevState, props) => ({
        cart: data.cart
      }))
    })
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners(BROADCAST_CART_TO_COMPONENT)
  }

  render() {
    const { cart } = this.state
    return(
      <nav>
        <div className="nav-wrapper blue-grey darken-4">
          <Link to="/brands" replace className="brand-logo" style={{paddingLeft: "20px"}}>时新汽配</Link>
          <ul className="right hide-on-med-and-down">
            <li><Link to="/brands" replace className="bold">厂商列表</Link></li>
            <li><Link to="/orders" replace className="bold">所有订单</Link></li>
            {/* <li><Link to="/profit" replace className="bold">业绩统计</Link></li> */}
            <li><Link to="/companies" replace className="bold">购货单位管理</Link></li>
            <li><Link to="/logs" replace className="bold">进出库记录</Link></li>
            <li>
              <Link to="/cart" replace className="bold">购物车 
                {
                  cart.length > 0 ? <span className="new badge red" data-badge-caption="批次">{cart.length}</span> : ""
                }
              </Link>
            </li>
            <li><Link to="/" className="bold">退出系统</Link></li>
          </ul>
        </div>
      </nav>
    )
  }
}

export default Header