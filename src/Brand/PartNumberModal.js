import React from 'react'
import M from 'materialize-css'
import { Formik } from 'formik'
import * as Yup from 'yup'

import {FlashMessage} from '../FlashMessage'
import { ADD_PART_TO_CART } from '../constants'

const { ipcRenderer } = window.require("electron")

class PartNumberModal extends React.Component {
  constructor(props) {
    super(props)

    this.formik = React.createRef()
    this.numberInput = React.createRef()
    this.salePriceInput = React.createRef()

    this.submit = this.submit.bind(this)
  }

  componentDidMount() {
    M.updateTextFields()
  }

  componentDidUpdate() {
    this.formik.current.resetForm()
    this.numberInput.current.focus()
  }

  submit(values) {
    const part = {
      ...this.props.part,
      cartQuantity: parseInt(this.numberInput.current.value),
      cartSalePrice: parseFloat(this.salePriceInput.current.value)
    }
    // ToDo
    ipcRenderer.sendSync(ADD_PART_TO_CART, part)
  }

  render() {
    const { part } = this.props
    return(
      <div id="modal1" className="modal">
        <div className="modal-content">
          {
            part ?
            <table>
              <thead>
                <tr>
                  <th>配件名称</th>
                  <th>库存量</th>
                  <th>进货价(元)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{part.name}</td>
                  <td><span className={part.quantity < 3 ? "red-text" : "green-text"}>{part.quantity}</span>{part.unit}</td>
                  <td>{part.importPrice}</td>
                </tr>
              </tbody>
            </table>
            : ""
          }
          <br/>
          <Formik
            ref={this.formik}
            initialValues={{ 
              cartQuantity: 1,
              cartSalePrice: part ? part.salePrice : 0
            }}
            onSubmit={(values, {setSubmitting}) => {
              this.submit(values)
            }}
            validationSchema={Yup.object().shape({
              cartQuantity: Yup.string()
                .required('数量不能为空'),
              cartSalePrice: Yup.number()
                .required('销售价不能为空'),
            })}
          >
            {props => {
              const {
                touched,
                values,
                errors,
                handleChange,
                handleBlur,
                handleSubmit,
              } = props;
              return (
                <form onSubmit={handleSubmit}>
                  {errors.cartQuantity && touched.cartQuantity && <FlashMessage props={{status: "error", msg: errors.cartQuantity}} />}
                  {errors.cartSalePrice && touched.cartSalePrice && <FlashMessage props={{status: "error", msg: errors.cartSalePrice}} />}

                  <div className="row no-margin">
                    <div className="input-field col m6 s6">
                      <input 
                        type="number" 
                        name="cartQuantity" 
                        id="number"
                        value={values.cartQuantity}
                        ref={this.numberInput}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoFocus
                      />
                      <label htmlFor="number">出库数量 <span className="required">*</span></label>
                    </div>
                    <div className="input-field col m6 s6">
                      <input 
                        type="number"
                        step="any"
                        name="cartSalePrice" 
                        id="salePrice"
                        value={values.cartSalePrice}
                        ref={this.salePriceInput}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="validate"
                      />
                      <label htmlFor="salePrice" className="active">售价(元) <span className="required">*</span></label>
                    </div>
                  </div>

                  <br/>
                  <div className="row no-margin">
                    <div className="input-field col m6 s6">
                      {
                        (errors.cartQuantity && touched.cartQuantity) || (errors.cartSalePrice && touched.cartSalePrice) ?
                        <button type="button" disabled className="btn">添加</button>
                        :
                        <button type="button" className="btn modal-close" onClick={this.submit}>添加</button>
                      }
                    </div>
                  </div>

                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    )
  }
}

export default PartNumberModal