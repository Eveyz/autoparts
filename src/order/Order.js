import React from 'react'
import { Link } from 'react-router-dom'

import Header from '../layouts/Header'
import CartList from '../cart/CartList'
import Loading from '../layouts/Loading'
import CartCancel from '../cart/CartCancel'
import { getToday } from '../utils'
import { createLog } from '../log/log_actions'
import { findOrder, updateOrder } from './order_actions'
import { updatePartStorage } from '../Brand/part_actions'
import { toRMBWords } from '../utils'

const { ipcRenderer } = window.require("electron")

class Order extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      order: null,
      mode: "READ"
    }

    this.printDiv = React.createRef()
    this.print = this.print.bind(this)
    this.modify = this.modify.bind(this)
    this.payDebt = this.payDebt.bind(this)
    this.cancel = this.cancel.bind(this)
    this.cancelEdit = this.cancelEdit.bind(this)
    this.submitUpdateOrder = this.submitUpdateOrder.bind(this)
  }

  getOrder() {
    findOrder(this.props.match.params._id, (err, order) => {
      this.setState((prevState, props) => ({
        isLoading: false,
        order: order
      }))
    })
  }

  componentDidMount() {
    this.getOrder()
  }

  modify() {
    this.setState({
      mode: "EDIT"
    })
  }

  payDebt() {
    updateOrder(this.props.match.params._id, { 
      paid: true,
    }, (err, num) => {
      this.setState({
        mode: "READ"
      })
      this.getOrder()
    })
  }

  cancel() {
    this.state.order.parts.forEach(p => {
      // create logs
      var d = new Date()
      createLog({
        part_id: p._id,
        part_name: p.name,
        part_brand: p.brand,
        date: getToday(),
        time: d.getTime(),
        type: "in",
        quantity: p.cartQuantity,
        price: p.cartSalePrice
      }, (err, log) => {
        if(err) console.log(err)
      })
      updatePartStorage(p._id, p.cartQuantity, () => {})
    })
    updateOrder(this.props.match.params._id, { 
      cancel: true,
    }, (err, num) => {
      this.setState({
        mode: "READ"
      })
      this.getOrder()
    })
  }

  cancelEdit() {
    this.setState({
      mode: "READ"
    })
  }

  submitUpdateOrder(_parts) {
    var _profit = 0, sum = 0
    _parts.forEach(p => {
      var diff = 0
      this.state.order.parts.forEach(_p => {
        if(_p._id === p._id) {
          diff = _p.cartQuantity - p.cartQuantity
        }
      })
      sum += p.cartSalePrice * p.cartQuantity
      updatePartStorage(p._id, diff, () => {})
      _profit += (p.salePrice - p.importPrice) * p.cartQuantity

      var d = new Date()
      createLog({
        part_id: p._id,
        part_name: p.name,
        part_brand: p.brand,
        date: getToday(),
        time: d.getTime(),
        type: diff > 0 ? "in" : "out",
        quantity: diff,
        price: p.cartSalePrice
      }, (err, log) => {
        if(err) console.log(err)
      })

    })
    updateOrder(this.props.match.params._id, { 
      parts: _parts,
      profit: _profit,
      amount: sum
    }, (err, num) => {
      this.setState({
        mode: "READ"
      })
      this.getOrder()
    })
  }

  print() {
    ipcRenderer.sendSync("printPDF", this.printDiv.current.innerHTML)
  }

  render() {
    const { isLoading, order, mode } = this.state
    const cancelled = order && order.cancel ? order.cancel : false

    var sum = 0, quantity = 0
    if(!isLoading) {
      order.parts.forEach(p => {
        sum += p.cartSalePrice * p.cartQuantity
        quantity += p.cartQuantity
      })
    }

    // const container = {
    //   width: "70%",
    //   margin: "0 auto",
    //   maxWidth: "1280px"
    // }

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
        {
          isLoading ? <Loading /> :
          <React.Fragment>
            <div className="container">
              <br/>
              <Link to={`/orders`} className="btn white black-text">返回所有订单列表</Link>
              {
                mode === "READ" ?
                <div>
                  <br/>
                  <h5>利润: <span className={order.profit > 0 ? "green-text" : "red-text"}>{order.profit ? order.profit.toFixed(2) : 0}</span>元</h5>
                  <button className="btn btn-large" onClick={this.print}>打印订单</button>
                  {/* <button className="btn btn-large blue" style={{marginLeft: "15px"}} disabled={cancelled} onClick={this.modify}>修改订单</button> */}
                  <Link to={`/orders/${this.props.match.params._id}/edit`} style={{marginLeft: "15px"}} disabled={cancelled} className="btn btn-large blue">编辑订单</Link>
                  {
                    order.paid ?
                    <button className="btn btn-large blue" style={{marginLeft: "15px"}} disabled={true}><span className="green-text">&#10004; 已付清</span></button>
                    :
                    <button className="btn btn-large blue" style={{marginLeft: "15px"}} disabled={cancelled} onClick={() => {
                      if(window.confirm('确认账单已付清?')) {
                        this.payDebt()
                      }
                    }}>付清</button>
                  }
                  <button className="btn btn-large red right" disabled={cancelled} style={{marginLeft: "15px"}} onClick={() => {
                    if(window.confirm('确认要退单?')) {
                      this.cancel()
                    }
                  }}>退单</button>
                  <hr/>
                  <div>
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
                        <div style={{...col, ...m4, ...noMargin}}><p style={pInfo}>订单: {order.orderNum ? order.orderNum : order._id}</p></div>
                        <div style={{...col, ...m4, ...noMargin}}><p style={pInfo}>付款方式: {order.payMethod}</p></div>
                      </div>
                      <div style={{...row, ...noMargin}}>
                        <div style={{...col, ...m12, ...noMargin}}><p style={pInfo}>营业员: {order.personnel}</p></div>
                      </div>

                    </div>
                    <br/>
                  </div>
                </div>
                :
                <div>
                  <CartCancel 
                    cart={order.parts}
                    submitUpdateOrder={this.submitUpdateOrder}
                    cancelEdit={this.cancelEdit} 
                  />
                </div>
              }
            </div>
          </React.Fragment>
        }
      </div>
    )
  }
}

export default Order