import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import {FlashMessage} from '../FlashMessage'

class AddPartNumberModal extends React.Component {
  constructor(props) {
    super(props)

    this.formik = React.createRef()
    this.cartQuantityInput = React.createRef()

    this.submit = this.submit.bind(this)
  }

  componentDidUpdate() {
    this.formik.current.resetForm()
    this.cartQuantityInput.current.focus()
  }

  submit() {
    this.props.addPartQuantity(this.props.id, this.cartQuantityInput.current.value)
  }

  render() {
    return(
      <div id="modal2" className="modal">
        <div className="modal-content">
          <Formik
            ref={this.formik}
            initialValues={{ 
              cartQuantity: 1
            }}
            onSubmit={(values, {setSubmitting}) => {
              this.submit(values)
            }}
            validationSchema={Yup.object().shape({
              cartQuantity: Yup.string()
                .required('数量不能为空'),
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

                  <div className="row no-margin">
                    <div className="input-field col m12 s12">
                      <input 
                        type="number" 
                        name="cartQuantity" 
                        id="cartQuantity"
                        value={values.cartQuantity}
                        ref={this.cartQuantityInput}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoFocus
                      />
                      <label htmlFor="cartQuantity">入库数量 <span className="required">*</span></label>
                    </div>
                  </div>
                  <div className="row no-margin">
                    <div className="input-field col m6 s6">
                      {
                        (errors.cartQuantity && touched.cartQuantity) || (errors.cartSalePrice && touched.cartSalePrice) ?
                        <button type="button" disabled className="btn">入库</button>
                        :
                        <button type="button" className="btn modal-close" onClick={this.submit}>入库</button>
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

export default AddPartNumberModal