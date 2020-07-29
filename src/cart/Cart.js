import React from 'react'
import M from 'materialize-css'

import { brandChinese } from '../utils'

class Cart extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      cartQuantity: this.props.cart.cartQuantity || 1
    }

    this.cartQuantity = React.createRef()

    this.changeQuanlity = this.changeQuanlity.bind(this)
    this.handleNullValue = this.handleNullValue.bind(this)
    this.delete = this.delete.bind(this)
  }

  componentDidUpdate() {
    M.updateTextFields()
  }

  changeQuanlity() {
    var val = parseInt(this.cartQuantity.current.value)
    if(val === 0) {
      val = 1
      this.cartQuantity.current.value = val
    }
    this.props.changeQuanlity(this.props.cart._id, val, this.props.cart.cartSalePrice)
  }

  handleNullValue() {
    var val = parseInt(this.cartQuantity.current.value)
    if(!val) {
      val = 1
      this.cartQuantity.current.value = val
      this.props.changeQuanlity(this.props.cart._id, val)
    }
  }

  delete = (id, cartSalePrice) => (e) => {
    this.props.removePartFromCart(id, cartSalePrice)
  }

  render() {
    const { cart, readOnly } = this.props

    const tr = {
      borderBottom: "1px solid rgba(0,0,0,0.12)",
      display: "table-row",
      verticalAlign: "inherit",
    }

    const td = {
      fontSize: "14px",
      padding: "10px 5px",
      display: "table-cell",
      textAlign: "left",
      verticalAlign: "middle",
      borderRadius: "2px",
    }

    if(readOnly) {
      return  <tr style={tr} className="cart-td-padding-readOnly">
                <td>{cart.order}</td>
                <td style={td}>{cart.name}</td>
                <td style={td}>{brandChinese[cart.brand]}</td>
                <td style={td}>{cart.carType}</td>
                <td style={td}>{cart.unit}</td>
                <td style={td}>{cart.cartQuantity}</td>
                <td style={td}>{cart.cartSalePrice}</td>
                <td style={td}>{cart.cartSalePrice && cart.cartQuantity ? (cart.cartSalePrice * cart.cartQuantity).toFixed(2) : 0}</td>
              </tr>
    }

    return(
      <tr className="cart-td-padding">
        <td>{cart.order}</td>
        <td>{cart.name}</td>
        <td>{brandChinese[cart.brand]}</td>
        <td>{cart.carType}</td>
        <td>{cart.unit}</td>
        <td>{cart.cartSalePrice}</td>
        <td>
          <div className="input-field col s6">
            <input
              key={`cart-${cart._id}`}
              type="number"
              className="validate"
              defaultValue={cart.cartQuantity} 
              style={{maxWidth: "80px"}}
              ref={this.cartQuantity}
              onChange={this.changeQuanlity}
              onBlur={this.handleNullValue}
            />
          </div>
        </td>
        <td>
          <button type="button" className="btn red bold" onClick={this.delete(cart._id, cart.cartSalePrice)}>移除</button>
        </td>
      </tr>
    )
  }
}

export default Cart