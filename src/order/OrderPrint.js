import React from 'react'
import { Link } from 'react-router-dom'

import Header from '../layouts/Header'
import CartList from '../cart/CartList'
import Loading from '../layouts/Loading'
import { findOrder } from './order_actions'
import { toRMBWords } from '../utils'

const { ipcRenderer } = window.require("electron")

class OrderPrint extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      order: null
    }

    this.printDiv = React.createRef()
    this.print = this.print.bind(this)
  }

  componentDidMount() {
    findOrder(this.props.match.params._id, (err, order) => {
      this.setState((prevState, props) => ({
        isLoading: false,
        order: order
      }))
      ipcRenderer.sendSync("printPDF", this.printDiv.current.innerHTML)
    })
  }

  print() {
    ipcRenderer.sendSync("printPDF", this.printDiv.current.innerHTML)
  }

  render() {
    const { isLoading, order } = this.state

    if(isLoading) return <Loading />

    var sum = 0, quantity = 0
    order.parts.forEach(p => {
      sum += p.cartSalePrice * p.cartQuantity
      quantity += p.cartQuantity
    })

    const container = {
      width: "70%",
      margin: "0 auto",
      maxWidth: "1280px"
    }

    const h4 = {
      fontSize: "2.28rem",
      lineHeight: "110%",
      margin: "10px 0 .912rem 0",
      fontWeight: "400",
      display: "block",
      marginInlineStart: "0px",
      marginInlineEnd: "0px",
    }

    const h5 = {
      lineHeight: "110%",
      margin: "10px 0 10px 0",
      fontWeight: "400",
      display: "block",
      marginBlockStart: "0px",
      marginInlineStart: "0px",
      marginInlineEnd: "0px",
    }

    const center = {
      textAlign: "center"
    }

    const noMargin = {
      margin: "0px"
    }

    const noPadding = {
      padding: "0px"
    }

    const row = {
      display: "table",
      width: "100%",
      marginLeft: "auto",
      marginReft: "auto",
      marginBottom: "20px"
    }

    const col = {
      display: "table",
      float: "left",
      boxSizing: "border-box",
      padding: "0 .75rem",
      minHeight: "1px",
      marginLeft: "auto",
      left: "auto",
      right: "auto",
    }

    const m12 = {
      width: "100%"
    }

    const m8 = {
      width: "66.6666666666%"
    }

    const m4 = {
      width: "33.3333333333%"
    }

    const m3 = {
      width: "25%"
    }

    const m2 = {
      width: "16.6666666667%"
    }

    const pInfo = {
      marginTop: "3px", marginBottom: "3px", fontSize: "14px"
    }

    const card = {
      position: "relative",
      margin: ".5rem 0 1rem 0",
      backgroundColor: "#fff",
      WebkitTransition: "-webkit-box-shadow .25s",
      transition: "box-shadow .25s",
      borderRadius: "2px",
      boxShadow: "0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2)"
    }

    const cardContent = {
      padding: "15px 24px 15px 24px",
      borderRadius: "0 0 2px 2px"
    }

    const right = {
      float: "right"
    }

    return(
      <div>
        <Header />
        <div className="container">
          <br/>
          <Link to={`/orders`} className="btn white black-text">返回</Link>
          <h5>利润: <span className={order.profit > 0 ? "green-text" : "red-text"}>{order.profit ? order.profit.toFixed(2) : 0}</span>元</h5>
          <button className="btn btn-large" onClick={this.print}>打印订单</button>
          <hr/>
        </div>
        <div style={container}>
          <div ref={this.printDiv}>
            <h4 style={{...center, ...h4}}>汽车配件清单</h4>

            <div style={{...row, ...noMargin}}>
              <div style={{...col, ...m4, ...noPadding}}>
                <p style={pInfo}>购货单位: {order.company}</p>
              </div>
              <div style={{...col, ...m3, ...noPadding}}>
                <p style={pInfo}>税号: {order.tax}</p></div>
              <div style={{...col, ...m2, ...noPadding}}>
                <p style={pInfo}>日期: {order.date}</p></div>
              <div style={{...col, ...m3, ...noPadding}}>
                <p style={pInfo}>发票号: {order.receipt}</p></div>
            </div>

            <div style={{...row, ...noMargin}}>
              <div style={{...col, ...m8, ...noPadding}}>
                <p style={pInfo}>地址电话: {order.address} {order.phone}</p></div>
              <div style={{...col, ...m4, ...noPadding}}>
                <p style={pInfo}>开户银行及账号: {order.bank}</p></div>
            </div>

            <div style={{...card, margin: "0px"}}>
              <div style={cardContent}>

                <CartList cart={order.parts} readOnly={true} />
                <br/>
                <div style={{...row, ...noMargin}}>
                  <div style={{...col, ...m12, ...noMargin}}><h5 style={{...right, fontSize: "15px", ...h5}}>数量合计: {quantity} 金额合计: {sum.toFixed(2)}元</h5></div>
                </div>
                <div style={{...row, ...noMargin}}>
                  <div style={{...col, ...m12, ...noMargin}}><h5 style={{...right, fontSize: "15px", ...h5}}>人民币大写: {toRMBWords(sum.toFixed(2))}</h5></div>
                </div>
              </div>
            </div>

            <div style={{...row, ...noMargin}}>
              <div style={{...col, ...m4, ...noMargin}}><p style={pInfo}><b>配件出门, 恕不退换!</b></p></div>
              <div style={{...col, ...m4, ...noMargin}}><p style={pInfo}>订单: {order._id ? order.orderNum : order._id}</p></div>
              <div style={{...col, ...m4, ...noMargin}}><p style={pInfo}>付款方式: {order.payMethod}</p></div>
            </div>
            <div style={{...row, ...noMargin}}>
              <div style={{...col, ...m12, ...noMargin}}><p style={pInfo}>营业员: {order.personnel}</p></div>
            </div>

          </div>
          <br/>
        </div>
      </div>
    )
  }
}

export default OrderPrint