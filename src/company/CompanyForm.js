import React from 'react'
import * as Yup from 'yup'
import M from 'materialize-css'
import { Formik } from 'formik'

class CompanyForm extends React.Component {
  constructor(props) {
    super(props)

    this.name = React.createRef()
    this.address = React.createRef()
    this.phone = React.createRef()
    this.bank = React.createRef()
    this.personnel = React.createRef()
    this.tax = React.createRef()
    this.receipt = React.createRef()

    this.submit = this.submit.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  componentDidMount() {
    M.updateTextFields()
  }

  cancel() {
    this.props.cancel()
  }

  submit(values) {
    var d = new Date()
    const company = {
      name: this.name.current.value,
      address: this.address.current.value,
      phone: this.phone.current.value,
      bank: this.bank.current.value,
      tax: this.tax.current.value,
      receipt: this.receipt.current.value,
      time: d.getTime()
    }
    this.props.mode === "ADD" ? this.props.addCompany(company) : this.props.updateCompany(this.props.company._id, company)
  }

  render() {
    return(
      <div>
        <Formik
          ref={this.formik}
          initialValues={{ 
            name: this.props.company.name ||  "",
            address: this.props.company.address ||  "",
            phone: this.props.company.phone ||  "",
            bank: this.props.company.bank ||  "",
            personnel: this.props.company.personnel ||  "",
            tax: this.props.company.tax ||  "",
            receipt: this.props.company.receipt ||  ""
          }}
          onSubmit={(values, {setSubmitting}) => {
            this.submit(values)
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .required('单位不能为空'),
          //   address: Yup.string()
          //   .required('单位地址不能为空'),
          })}
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

                <div className="card no-margin">
                  <div className="card-content">
                    <div className="row no-margin">
                      <div className="input-field col m6 s6">
                        <input 
                          type="text" 
                          name="name" 
                          id="name"
                          value={values.name}
                          ref={this.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <label htmlFor="name">购货单位</label>
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
                      <div className="input-field col m6 s12">
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
                      <div className="input-field col m6 s12">
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
                    </div>

                    <div className="row no-margin">
                      <div className="input-field col m6 s12">
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
                      <div className="input-field col m6 s12">
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
                  <div className="input-field col m6 s12">
                    <button type="button" className="btn" onClick={this.submit}>添加</button>
                  </div>
                  <div className="input-field col m6 s12">
                    <button type="button" className="btn white black-text right" onClick={this.cancel}>取消</button>
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

export default CompanyForm