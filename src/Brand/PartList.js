import React from 'react'

import PartNumberModal from './PartNumberModal'
import AddPartNumberModal from './AddPartNumberModal'

class PartList extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      part: null
    }

    this.modalTrigger = React.createRef()
    this.addModalTrigger = React.createRef()

    this.delete = this.delete.bind(this)
    this.update = this.update.bind(this)
    this.increaseStorage = this.increaseStorage.bind(this)
    this.addPartQuantity = this.addPartQuantity.bind(this)
    this.addToCart = this.addToCart.bind(this)
  }

  delete = (id) => (e) => {
    this.props.deletePart(id)
  }

  update = (part) => (e) => {
    this.props.updateMode(part)
  }

  increaseStorage = (part) => (e) => {
    this.addModalTrigger.current.click()
    this.setState((prevState, props) => ({
      part: part
    }))
    // this.props.increaseStorage(id)
  }

  addPartQuantity(id, value) {
    this.props.addPartQuantity(id, value)
  }

  addToCart = (part) => (e) => {
    this.modalTrigger.current.click()
    this.setState((prevState, props) => ({
      part: part
    }))
  }

  render() {
    const { part } = this.state
    var _brand = ""
    switch(this.props.brand) {
      case "toyota":
        _brand = "丰田"
        break
      case "nissan":
        _brand = "日产"
        break
      case "mitsubishi":
        _brand = "三凌"
        break
      case "honda":
        _brand = "本田"
        break
      default:
        _brand = "丰田"
        break
    }

    if(this.props.data.length === 0) {
      return <div className="row">
                <div className="col s12 m12">
                  <div className="card">
                    <div className="card-content black-text">
                      <h4 className="center">当前没有{_brand}配件</h4>
                    </div>
                  </div>
                </div>
              </div>
    }

    const _partList = this.props.data.map((part, idx) => {
      return <tr key={idx}>
                <td>{part.number}</td>
                <td>{part.order}</td>
                <td>{part.name}</td>
                <td>{part.carType}</td>
                <td>{part.unit}</td>
                <td>{part.quantity}</td>
                <td>{part.importPrice ? part.importPrice.toFixed(2) : part.importPrice}</td>
                <td>{part.salePrice ? part.salePrice.toFixed(2) : part.salePrice}</td>
                <td>
                  <i className="material-icons clickable blue-text" onClick={this.update(part)}>edit</i>
                </td>
                <td>
                  <i className="material-icons clickable cyan-text" onClick={this.increaseStorage(part)}>add</i>
                </td>
                <td>
                  <i className="material-icons clickable teal-text" onClick={this.addToCart(part)}>add_shopping_cart</i>
                </td>
                <td>
                  <i className="material-icons clickable red-text" onClick={() => { 
                    if(window.confirm('确认要删除配件嘛?')) {
                      this.props.deletePart(part._id)
                    }
                  }
                  }>delete</i>
                </td>
              </tr>
    })

    return(
      <div>
        <a ref={this.modalTrigger} className="btn modal-trigger" href="#modal1" style={{display: "none"}}>加入订单</a>
        <a ref={this.addModalTrigger} className="btn modal-trigger" href="#modal2" style={{display: "none"}}>入库</a>
        <AddPartNumberModal id={part ? part._id : null} addPartQuantity={this.addPartQuantity} />
        <PartNumberModal part={part} />
        <table>
          <thead>
            <tr>
              <th>库次</th>
              <th>编号</th>
              <th>配件名</th>
              <th>车型</th>
              <th>量位</th>
              <th>数量</th>
              <th>进货价(元)</th>
              <th>默认售价(元)</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {_partList}
          </tbody>
        </table>
      </div>
    )
  }
}

export default PartList