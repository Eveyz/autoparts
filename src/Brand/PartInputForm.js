import React from 'react';
import M from 'materialize-css';
import { Formik } from 'formik';
import * as Yup from 'yup';

import {FlashMessage} from '../FlashMessage'
import { brandChinese } from '../utils'

class PartInputForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valid:  false
    }

    this.numberInput = React.createRef();
    this.orderInput = React.createRef();
    this.nameInput = React.createRef();
    this.carTypeInput = React.createRef();
    this.unitInput = React.createRef();
    this.quantityInput = React.createRef();
    this.importPriceInput = React.createRef();
    this.salePriceInput = React.createRef();

    this.submit = this.submit.bind(this);
    this.cancel = this.cancel.bind(this)
  }

  componentDidMount() {
    M.updateTextFields()
  }

  cancel() {
    this.props.cancel()
  }

  submit() {
    const part = {
      number: this.numberInput.current.value.trim(),
      order: this.orderInput.current.value.trim(),
      name: this.nameInput.current.value.trim(),
      carType: this.carTypeInput.current.value.trim(),
      unit: this.unitInput.current.value.trim(),
      quantity: parseInt(this.quantityInput.current.value.trim()),
      importPrice: parseFloat(this.importPriceInput.current.value.trim()),
      salePrice: parseFloat(this.salePriceInput.current.value.trim()),
      brand: this.props.brand
    }
    this.props.mode === "ADD" ? this.props.addPart(part) : this.props.updatePart(this.props.part._id, part)
  }

  render() {

    return (
      <div>
        <div>
          <br/>
          <div className="container">
          
            <div className="row no-margin">
              <div className="col s12 m12">
                <div className="card r-box-shadow">
                  <div className="card-content">
                    <h4 className="center">添加新{brandChinese[this.props.brand]}配件</h4>
                    <br/>
                    <Formik
                      initialValues={{ 
                        number: this.props.part.number || "", 
                        order: this.props.part.order || "",
                        name: this.props.part.name || "",
                        carType: this.props.part.carType || "",
                        unit: this.props.part.unit || "",
                        quantity: this.props.part.quantity || "",
                        importPrice: this.props.part.importPrice || "",
                        salePrice: this.props.part.salePrice || ""
                      }}
                      onSubmit={(values, { setSubmitting }) => {
                        this.submit(values);
                      }}
                      validationSchema={Yup.object().shape({
                        // number: Yup.string()
                        //   .required('库次不能为空'),
                        order: Yup.string()
                          .required('编码不能为空'),
                        name: Yup.string()
                          .required('配件名不能为空'),
                        carType: Yup.string()
                          .required('车型不能为空'),
                        unit: Yup.string()
                          .required('量位不能为空'),
                        quantity: Yup.number()
                          .required('数量不能为空'),
                        importPrice: Yup.number()
                          .required('进货价不能为空'),
                        salePrice: Yup.number()
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
                            {errors.number && touched.number && <FlashMessage props={{status: "error", msg: errors.number}} />}
                            {errors.order && touched.order && <FlashMessage props={{status: "error", msg: errors.order}} />}
                            {errors.name && touched.name && <FlashMessage props={{status: "error", msg: errors.name}} />}
                            {errors.carType && touched.carType && <FlashMessage props={{status: "error", msg: errors.carType}} />}
                            {errors.unit && touched.unit && <FlashMessage props={{status: "error", msg: errors.unit}} />}
                            {errors.quantity && touched.quantity && <FlashMessage props={{status: "error", msg: errors.quantity}} />}
                            {errors.importPrice && touched.importPrice && <FlashMessage props={{status: "error", msg: errors.importPrice}} />}
                            {errors.salePrice && touched.salePrice && <FlashMessage props={{status: "error", msg: errors.salePrice}} />}

                            <div className="row no-margin">
                              <div className="input-field col m6 s6">
                                <input 
                                  type="text" 
                                  name="number" 
                                  id="number"
                                  value={values.number}
                                  ref={this.numberInput}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="validate"
                                  autoFocus
                                  placeholder="0001"
                                />
                                <label htmlFor="number">库次 <span className="required">*</span></label>
                              </div>
                              <div className="input-field col m6 s6">
                                <input 
                                  type="text" 
                                  name="order" 
                                  id="order"
                                  value={values.order}
                                  ref={this.orderInput}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="validate"
                                  placeholder="87139-30040"
                                />
                                <label htmlFor="order">编码 <span className="required">*</span></label>
                              </div>
                            </div>

                            <div className="row no-margin">
                              <div className="input-field col m12 s12">
                                <input 
                                  type="text" 
                                  name="name" 
                                  id="name"
                                  value={values.name}
                                  ref={this.nameInput}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="validate"
                                />
                                <label htmlFor="name">配件名 <span className="required">*</span></label>
                              </div>
                            </div>

                            <div className="row no-margin">
                              <div className="input-field col m12 s12">
                                <input 
                                  type="text" 
                                  name="carType" 
                                  id="carType"
                                  value={values.carType}
                                  ref={this.carTypeInput}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="validate"
                                />
                                <label htmlFor="carType">车型 <span className="required">*</span></label>
                              </div>
                            </div>

                            <div className="row no-margin">
                              <div className="input-field col m6 s6">
                                <input 
                                  type="text" 
                                  name="unit" 
                                  id="unit"
                                  value={values.unit}
                                  ref={this.unitInput}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="validate"
                                />
                                <label htmlFor="unit">量位(只) <span className="required">*</span></label>
                              </div>
                              <div className="input-field col m6 s6">
                                <input 
                                  type="number" 
                                  name="quantity" 
                                  id="quantity"
                                  value={values.quantity}
                                  ref={this.quantityInput}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="validate"
                                />
                                <label htmlFor="quantity">数量 <span className="required">*</span></label>
                              </div>
                            </div>

                            <div className="row no-margin">
                              <div className="input-field col m6 s6">
                                <input 
                                  type="number" 
                                  step="any"
                                  name="importPrice" 
                                  id="importPrice"
                                  value={values.importPrice}
                                  ref={this.importPriceInput}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="validate"
                                />
                                <label htmlFor="importPrice">进货价(元) <span className="required">*</span></label>
                              </div>
                              <div className="input-field col m6 s6">
                                <input 
                                  type="number"
                                  step="any"
                                  name="salePrice" 
                                  id="salePrice"
                                  value={values.salePrice}
                                  ref={this.salePriceInput}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="validate"
                                />
                                <label htmlFor="salePrice">默认售价(元) <span className="required">*</span></label>
                              </div>
                            </div>

                            <br/>
                            <div className="row no-margin">
                              <div className="input-field col m6 s6">
                                <button type="button" className="btn" onClick={this.submit}>完成</button>
                              </div>
                              <div className="input-field col m6 s6">
                                <button type="button" className="right btn white black-text" onClick={this.cancel}>返回</button>
                              </div>
                            </div>

                          </form>
                        );
                      }}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    )
  }
}

export default PartInputForm