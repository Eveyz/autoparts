import React from 'react'
import { Link } from 'react-router-dom'
import M from 'materialize-css'

import Header from '../layouts/Header'
import PartList from './PartList'
import PartInputForm from './PartInputForm'
import { SERACH_PARTS } from '../constants'
import Loading from '../layouts/Loading'
import { countParts, paginateParts, findPart, findParts, createPart, updatePart, removePart, updatePartStorage } from './part_actions'
import { createLog, updateLog, removeLog } from '../log/log_actions'
import { getToday } from '../utils'
import PaginationContainer from '../layouts/PaginationContainer'
import { paginateOrders } from '../order/order_actions'

const { ipcRenderer } = window.require("electron")

class PartListContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      count: 0,
      mode: "VIEW",
      parts: [],
      part: {},
      field: 'order',
      value: ''
    }

    this.selectValue = React.createRef()

    this.addMode = this.addMode.bind(this)
    this.cancel = this.cancel.bind(this)
    this.addPart = this.addPart.bind(this)
    this.deletePart = this.deletePart.bind(this)
    this.updateMode = this.updateMode.bind(this)
    this.updatePart = this.updatePart.bind(this)
    this.addPartQuantity = this.addPartQuantity.bind(this)
    this.selectField = this.selectField.bind(this)
    this.search = this.search.bind(this)
    this.getCurrentPageData = this.getCurrentPageData.bind(this)
  }

  componentDidMount() {
    M.AutoInit()
    countParts({"brand": this.props.brand}, (err, count) => {
      paginateParts({"brand": this.props.brand}, 0, 50, (err, parts) => {
        this.setState({
          count: count,
          isLoading: false,
          parts: parts
        })
      })
    })
  }

  componentDidUpdate() {
    M.AutoInit()
  }

  addMode() {
    this.setState({
      mode: "ADD",
      part: {}
    })
  }

  updateMode(part) {
    this.setState({
      mode: "EDIT",
      part: part
    })
  }

  addPart = (part) => {
    var d = new Date()
    createPart(part, (err, _part) => {
      // create log
      createLog({
        part_id: _part._id,
        part_name: _part.name,
        part_brand: _part.brand,
        date: getToday(),
        time: d.getTime(),
        type: "in",
        quantity: parseInt(part.quantity),
        price: _part.importPrice
      }, (err, log) => {
        if(err) console.log(err)
      })

      countParts({"brand": this.props.brand}, (err, count) => {
        paginateParts({"brand": this.props.brand}, 0, 50, (err, parts) => {
          this.setState({
            count: count,
            isLoading: false,
            parts: parts
          })
        })
      })
    })
  }

  updatePart = (id, part) => {
    updatePart(id, part, (err, num) => {
      // update log quantity to part quantity
      updateLog({part_id: id}, {
        part_brand: part.brand,
        price: part.importPrice,
        quantity: parseInt(part.quantity)
      }, (err) => {
        if(err) console.log(err)
      })

      this.getCurrentPageData(0)
    })
  }

  deletePart(id) {
    removePart(id, (err, num) => {
      // remove log since after part is removed
      removeLog({part_id: id}, (err) => {
        if(err) console.log(err)
      })

      countParts({"brand": this.props.brand}, (err, count) => {
        paginateParts({"brand": this.props.brand}, 0, 50, (err, parts) => {
          this.setState({
            count: count,
            isLoading: false,
            parts: parts
          })
        })
      })
    })
  }

  cancel() {
    this.setState({
      mode: "VIEW"
    })
  }

  addPartQuantity = (id, value) => {
    updatePartStorage(id, parseInt(value), (err, num) => {
      // create log
      var d = new Date()
      findPart(id, (err, part) => {
        if(err) console.log(err)
        createLog({
          part_id: id,
          part_name: part.name,
          part_brand: part.brand,
          date: getToday(),
          time: d.getTime(),
          type: "in",
          quantity: parseInt(value),
          price: part.importPrice
        }, (err, log) => {
          if(err) console.log(err)
        })
      })

      this.getCurrentPageData(0)
    })
  }

  selectField() {
    // paginateParts({"brand": this.props.brand}, 0, 50, (err, parts) => {
      // this.setState({
        // mode: "VIEW",
        // parts: parts,
        // value: ''
      // })
    // })
  }

  search(e) {
    var searchField = this.selectValue.current.value
    var searchVal = e.target.value.trim()
    const _data = ipcRenderer.sendSync(SERACH_PARTS, [this.props.brand, searchField, searchVal])
    this.setState({
      mode: "VIEW",
      parts: _data,
      value: searchVal
    })
  }

  getCurrentPageData(skip) {
    paginateParts({"brand": this.props.brand}, skip, 50, (err, parts) => {
      this.setState({
        mode: "VIEW",
        parts: parts
      })
    })
  }

  render() {
    const { isLoading, mode, parts, part,count } = this.state

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

    const breadCrumbFont = {
      "fontSize": "20px"
    }

    var content = mode === "VIEW" ? 
    <div className="row">
      <div className="col m10 offset-m1 s12">
        <div>
          <div className="col s12 no-padding">
            <Link to={`/brands`} style={breadCrumbFont}><b>所有车厂</b></Link> &gt; 
            <span style={breadCrumbFont}> {_brand}({count})</span>
          </div>
        </div>
        <br/>
        <br/>

        <button className="btn btn-large" style={{"fontSize": "20px"}} onClick={this.addMode}><i className="material-icons left">add</i>添加配件</button>
        <br/>
        <br/>
        <div className="row no-margin">
          <div className="input-field col s6 m6">
            <select 
              defaultValue="order" 
              ref={this.selectValue}
              onChange={this.selectField}
            >
              <option value="order">编号</option>
              <option value="number">库次</option>
              <option value="name">配件名</option>
              <option value="carType">车型</option>
            </select>
            <label>选择搜索项</label>
          </div>
          <div className="input-field col s6 m6">
            <input value={this.state.value} id="field" type="text" className="validate" onChange={this.search} />
            <label htmlFor="field">搜索</label>
          </div>
        </div>

        <PaginationContainer 
          itemsPerPage={50} 
          data={parts}
          total={count} 
          readOnly={true}
          getCurrentPageData={this.getCurrentPageData}
        >
          <PartList 
            data={parts} 
            updateMode={this.updateMode} 
            deletePart={this.deletePart} 
            brand={this.props.brand}
            addPartQuantity={this.addPartQuantity}
            history={this.props.history}
          />
        </PaginationContainer>
      </div>
    </div>
    : 
    <div>
      <div>
        <div className="row no-margin">
          <div className="col s12 m10 offset-m1">
            <button type="button bold" className="btn white black-text" onClick={this.cancel}>返回配件列表</button>
          </div>
        </div>
      </div>
      <PartInputForm 
        addPart={this.addPart} 
        updatePart={this.updatePart} 
        cancel={this.cancel}
        part={part} 
        mode={mode} 
        brand={this.props.brand} 
      />
    </div>
    
    if(isLoading) content = <Loading />

    return(
      <div>
        <Header />
        <br/>
        {content}
        
      </div>
    )
  }
}

export default PartListContainer