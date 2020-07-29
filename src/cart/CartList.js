import React from 'react'

import Cart from './Cart'

class CartList extends React.Component {
  constructor(props) {
    super(props);
    
    this.changeQuanlity = this.changeQuanlity.bind(this)
    this.removePartFromCart = this.removePartFromCart.bind(this)
  }
  
  changeQuanlity(id, cartQuantity, cartSalePrice) {
    this.props.changeQuanlity(id, cartQuantity, cartSalePrice)
  }

  removePartFromCart(id, cartSalePrice) {
    this.props.removePartFromCart(id, cartSalePrice)
  }

  render() {
    const { readOnly, cart } = this.props
    const table = {
      width: "100%",
      display: "table",
      borderCollapse: "collapse",
      borderSpacing: "0",
      border: "none"
    }
    const thead = {
      display: "table-header-group",
      verticalAlign: "middle",
      borderColor: "inherit",
    }
    const tr = {
      borderBottom: "1px solid rgba(0,0,0,0.12)",
      display: "table-row",
      verticalAlign: "inherit",
    }
    const th = {
      fontSize: "14px",
      padding: "10px 5px",
      display: "table-cell",
      textAlign: "left",
      verticalAlign: "middle",
      borderRadius: "2px",
      fontWeight: "bold"
    }

    const tbody = {
      display: "table-row-group",
      verticalAlign: "middle",
      borderColor: "inherit",
    }


    const cartTable = cart.length > 0 ?
    <table style={table}>
      <thead style={thead}>
        <tr style={tr}>
          <th style={th}>编号</th>
          <th style={th}>配件名</th>
          <th style={th}>厂商</th>
          <th style={th}>车型</th>
          <th style={th}>单位</th>
          <th style={th}>
            {
              readOnly ? "数量" : "单价(元)"
            }
          </th>
          <th style={th}>
            {
              readOnly ? "单价(元)" : "数量"
            }
          </th>
          {
            readOnly ? <th style={th}>金额(元)</th> : <th></th>
          }
        </tr>
      </thead>

      <tbody style={tbody}>
        {
          cart.map((c, idx) => {
            return  <Cart 
                      key={idx} 
                      readOnly={readOnly}
                      cart={c}
                      changeQuanlity={this.changeQuanlity}
                      removePartFromCart={this.removePartFromCart}
                    />
          })
        }
      </tbody>
    </table> : ""

    return(
      <div>
        {cartTable}
      </div>
    )
  }
}

export default CartList