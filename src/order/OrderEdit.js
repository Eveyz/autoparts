import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Header from '../layouts/Header'
import { findOrder, updateOrder } from './order_actions'
import Loading from '../layouts/Loading'
import { decreasePartQuantity } from '../Brand/part_actions'

const OrderEdit = (props) => {

  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrder] = useState(null)
  const [parts, setParts] = useState([])
  const [diff, setDiff] = useState({})
  const [base, setBase] = useState({})

  const fetchOrder = () => {
    findOrder(props.match.params._id, (err, order) => {
      setOrder(order)
      setParts(order.parts)

      let _diff = {}
      order.parts.forEach(p => {
        _diff[p._id] = p.cartQuantity
      })
      setBase(_diff)

      setIsLoading(false)
    })
  }

  useEffect(() => {
    fetchOrder()
  }, [])

  const save = () => {
    let _order = order
    _order.parts = parts

    let profit = 0
    _order.parts.forEach(p => {
      if(diff[p._id]) decreasePartQuantity(p._id, diff[p._id])
      profit += (p.cartSalePrice - p.importPrice) * p.cartQuantity
    })
    _order.profit = profit

    updateOrder(props.match.params._id, _order, (err, num) => {
      props.history.replace(`/orders/${props.match.params._id}`)
    })
  }

  const deletePart = (id, quantity) => {
    let _order = order
    _order.parts = order.parts.filter(p => p._id !== id)
    diff[id] = quantity
    setParts(_order.parts)
  }

  const updatePart = (part_id, field) => e => {
    let _order = order
    _order.parts.forEach(p => {
      if(p._id === part_id) {
        if(field === "cartSalePrice") {
          p[field] = parseFloat(e.target.value)
        } else {
          diff[p._id] = base[p._id] - parseInt(e.target.value)
          p[field] = parseInt(e.target.value)
        }
      }
    })
    setParts(_order.parts)
  }

  let partList = null
  if(parts.length > 0) {
    partList = parts.map((part, idx) => {
                return <tr key={idx}>
                          <td>{part.number}</td>
                          <td>{part.order}</td>
                          <td>{part.name}</td>
                          <td>{part.carType}</td>
                          <td>{part.importPrice ? part.importPrice.toFixed(2) : 0}</td>
                          <td><input type="number" defaultValue={part.cartSalePrice ? part.cartSalePrice.toFixed(2) : 0} onChange={updatePart(part._id, "cartSalePrice")}></input></td>
                          <td><input type="number" defaultValue={part.cartQuantity ?  part.cartQuantity : 0} onChange={updatePart(part._id, "cartQuantity")}></input></td>
                          <td>
                            <button type="button" className="btn red bold" onClick={() => { 
                                if(window.confirm('确认要删除配件嘛?')) {
                                  deletePart(part._id, part.cartQuantity)
                                }
                              }
                            }>删除</button>
                          </td>
                        </tr>
              })
  }

  return(
    <div>
      <Header />
      <div className="container">
        {
          isLoading ? 
          <Loading /> 
          :
          <div>
            <br/>
            <Link to={`/orders`} className="btn white black-text">返回所有订单列表</Link>
            <h4>编辑订单</h4>
            <table>
              <thead>
                <tr>
                  <th>库次</th>
                  <th>编号</th>
                  <th>配件名</th>
                  <th>车型</th>
                  <th>进货价(元)</th>
                  <th>售价(元)</th>
                  <th>数量</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {partList}
              </tbody>
            </table>
            <br/>
            <button type="button" className="btn btn-large" onClick={save}>保存</button>
            <Link to={`/orders/${props.match.params._id}`} className="btn btn-large right white black-text">返回</Link>
          </div>
        }
      </div>
    </div>
  )
}

export default OrderEdit