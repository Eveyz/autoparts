import React, { useState } from 'react'

import OrderPartRow from './OrderPartRow'

const CartCancel = (props) => {
  const [parts, setParts] = useState(() => {
    return props.cart
  })

  const submitUpdateOrder = () => {
    props.submitUpdateOrder(parts)
  }

  const changeQuanlity = (part_id, qty) => {
    const newParts = parts.map(p => {
      return p._id === part_id ? {...p, cartQuantity: qty} : p
    })
    setParts(newParts)
  }

  const changeCartSalePrice = (part_id, price) => {
    
  }

  const removePart = (part_id) => {
    const ps = parts.filter(p => p._id !== part_id)
    setParts(ps)
  }

  return  <div>
            <table>
              <thead>
                <tr>
                  <th>编号</th>
                  <th>配件名</th>
                  <th>厂商</th>
                  <th>车型</th>
                  <th>单位</th>
                  <th>单价(元)</th>
                  <th>数量</th>
                  <th>移除配件</th>
                </tr>
              </thead>

              <tbody>
                {
                  parts.map((c, idx) => {
                    return  <OrderPartRow 
                              key={idx} 
                              part={c}
                              changeQuanlity={changeQuanlity}
                              changeCartSalePrice={changeCartSalePrice}
                              removePart={removePart}
                            />
                  })
                }
              </tbody>
            </table>
            <br/>
            <button className="btn" onClick={submitUpdateOrder}>确认</button>
            <button className="btn white black-text right" onClick={() => props.cancelEdit()}>取消</button>
          </div>
}

export default CartCancel