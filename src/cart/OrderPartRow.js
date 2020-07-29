import React from 'react'

import { brandChinese } from '../utils'

const OrderPartRow = (props) => {

  const handleCartQuantity = e => {
    var val = parseInt(e.target.value)
    if(val) {
      props.changeQuanlity(props.part._id, val)
    }
  }

  const handleCartSalePrice = e => {
    var val = parseInt(e.target.value)
    if(val) {
      props.changeCartSalePrice(props.part._id, val)
    }
  }

  const remove = (part_id) => e => {
    props.removePart(part_id)
  }

  return  <tr className="cart-td-padding">
            <td>{props.part.order}</td>
            <td>{props.part.name}</td>
            <td>{brandChinese[props.part.brand]}</td>
            <td>{props.part.carType}</td>
            <td>{props.part.unit}</td>
            <td>
              <div className="input-field col s6">
                <input
                  key={`cart-sale-price-${props.part._id}`}
                  type="number"
                  className="validate"
                  defaultValue={props.part.cartSalePrice} 
                  style={{maxWidth: "80px"}}
                  onChange={handleCartSalePrice}
                />
              </div>
            </td>
            <td>
              <div className="input-field col s6">
                <input
                  key={`cart-${props.part._id}`}
                  type="number"
                  className="validate"
                  defaultValue={props.part.cartQuantity} 
                  style={{maxWidth: "80px"}}
                  onChange={handleCartQuantity}
                />
              </div>
            </td>
            <td>
              <button type="button" className="btn red bold" onClick={remove(props.part._id, props.part.cartSalePrice)}>移除</button>
            </td>
          </tr>
}

export default OrderPartRow