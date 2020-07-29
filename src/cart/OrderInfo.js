import React from 'react'
import { Formik } from 'formik'
import M from 'materialize-css'

import Loading from '../layouts/Loading'
import { findCompanies } from '../company/company_actions'

class OrderInfoForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      companies: [],
      company: {}
    }

    this.company = React.createRef()
    this.company_id = React.createRef()
    this.address = React.createRef()
    this.phone = React.createRef()
    this.bank = React.createRef()
    this.personnel = React.createRef()
    this.tax = React.createRef()
    this.receipt = React.createRef()
    this.payMethod = React.createRef()

    this.selectCompany = this.selectCompany.bind(this)
    this.submit = this.submit.bind(this)
  }

  componentDidUpdate() {
    M.AutoInit()
  }

  componentDidMount() {
    M.AutoInit()
    findCompanies({}, (err, companies) => {
      this.setState((prevState, props) => ({
        isLoading: false,
        companies: companies
      }))
    })
  }

  selectCompany = (e) => {
    const val = e.target.value
    this.setState((prevState, props) => ({
      company: prevState.companies[val]
    }))
  }

  submit(values) {
    const order = {
      company: this.company.current.value || this.state.company.name,
      company_id: this.state.company._id,
      address: this.address.current.value || this.state.company.address,
      phone: this.phone.current.value || this.state.company.phone,
      bank: this.bank.current.value || this.state.company.bank,
      personnel: this.personnel.current.value,
      tax: this.tax.current.value || this.state.company.tax,
      receipt: this.receipt.current.value || this.state.company.receipt,
      payMethod: this.payMethod.current.value
    }
    this.props.submitOrder(order)
  }

  render() {
    const { isLoading, companies } = this.state
    if(isLoading) return <Loading />

    return(
      <div>
        <Formik
          ref={this.formik}
          initialValues={{ 
            company: "",
            address: "",
            phone: "",
            bank: "",
            personnel: "",
            tax: "",
            receipt: ""
          }}
          onSubmit={(values, {setSubmitting}) => {
            this.submit(values)
          }}
          // validationSchema={Yup.object().shape({
          //   company: Yup.string()
          //     .required('单位不能为空'),
          //   address: Yup.string()
          //   .required('单位地址不能为空'),
          // })}
        >
          {props => {
            const {
              values,
              handleChange,
              handleBlur,
              handleSubmit,
            } = props;
            return (
              <form onSubmit={handleSubmit}>
                <br/>
                <div className="row no-margin">
                  <div className="input-field col m12 s12 no-padding">
                    <select ref={this.company_id} onChange={this.selectCompany} defaultValue="default">
                      <option value="default" disabled>选择购货单位</option>
                      {
                        companies.map((c, idx) => {
                          return <option value={idx} key={idx}>{c.name}</option>
                        })
                      }
                    </select>
                    <label>选择购货单位</label>
                  </div>
                </div>

                <h5 className="grey-text">或者填写购货单位</h5>

                <div className="card no-margin">
                  <div className="card-content">
                    <div className="row no-margin">
                      <div className="input-field col m6 s6">
                        <input 
                          type="text" 
                          name="company" 
                          id="company"
                          value={values.company}
                          ref={this.company}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <label htmlFor="company">购货单位</label>
                      </div>
                      <div className="input-field col m6 s6">
                        <input 
                          type="text"
                          name="phone" 
                          id="phone"
                          value={values.phone}
                          ref={this.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <label htmlFor="phone">单位电话</label>
                      </div>
                    </div>

                    <div className="row no-margin">
                      <div className="input-field col m12 s12">
                        <input 
                          type="text"
                          name="address" 
                          id="address"
                          value={values.address}
                          ref={this.address}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <label htmlFor="address">单位地址</label>
                      </div>
                    </div>

                    <div className="row no-margin">
                      <div className="input-field col m6 s6">
                        <input 
                          type="text" 
                          name="bank" 
                          id="bank"
                          value={values.bank}
                          ref={this.bank}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <label htmlFor="bank">开户银行及账号</label>
                      </div>
                      <div className="input-field col m6 s6">
                        <input 
                          type="text"
                          name="personnel" 
                          id="personnel"
                          value={values.personnel}
                          ref={this.personnel}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <label htmlFor="personnel">营业员</label>
                      </div>
                    </div>

                    <div className="row no-margin">
                      <div className="input-field col m6 s6">
                        <input 
                          type="text" 
                          name="tax" 
                          id="tax"
                          value={values.tax}
                          ref={this.tax}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <label htmlFor="tax">税号</label>
                      </div>
                      <div className="input-field col m6 s6">
                        <input 
                          type="text"
                          name="receipt" 
                          id="receipt"
                          value={values.receipt}
                          ref={this.receipt}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <label htmlFor="receipt">发票号</label>
                      </div>
                    </div>

                    
                  </div>
                </div>

                <div className="row no-margin">
                  <div className="input-field col m12 s12 no-margin">
                    <h5 className="right">总金额: {this.props.sum ? this.props.sum.toFixed(2) : 0}元</h5>
                  </div>
                </div>

                <div className="row no-margin">
                  <div className="input-field col m12 s12 no-margin">
                    <h5 className="right no-margin">数量合计: {this.props.quantity}</h5>
                  </div>
                </div>
                <br/>
                <div className="row no-margin">
                  <div className="input-field col offset-m9 m3 s12">
                    <select ref={this.payMethod}>
                      <option value="现金">现金</option>
                      <option value="赊账">赊账</option>
                      <option value="微信转账">微信转账</option>
                      <option value="银行汇款">银行汇款</option>
                    </select>
                    <label>付款方式</label>
                  </div>
                </div>

                <div className="row no-margin">
                  <div className="input-field col offset-m9 m3 s6">
                    <button type="button" disabled={this.props.quantity > 0 ? false : true} className="btn btn-large right" onClick={this.submit}>出库</button>
                  </div>
                </div>

              </form>
            );
          }}
        </Formik>
      </div>
    )
  }
}

export default OrderInfoForm