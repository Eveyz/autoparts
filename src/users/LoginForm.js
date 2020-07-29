import React from 'react';
import { Link } from 'react-router-dom';
import M from 'materialize-css';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { FlashMessage } from '../FlashMessage'
import { findUsers, authenticate, createUser } from './user_actions'

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "LOGIN",
      msg: null
    }
    this.usernameInput = React.createRef();
    this.passwordInput = React.createRef();

    this.login = this.login.bind(this);
    this.removeMsg = this.removeMsg.bind(this);
  }

  componentDidMount() {
    M.updateTextFields();
    this.usernameInput.current.focus()
    // M.AutoInit();
    findUsers({}, (err, users) => {
      if(users.length <= 0) {
        this.setState({
          mode: "SIGNUP"
        })
      }
    })
  }

  login() {
    const user = {
      username: this.usernameInput.current.value.trim(),
      password: this.passwordInput.current.value.trim()
    }
    if(this.state.mode === "SIGNUP") {
      createUser(user, (err, _user) =>{
        this.props.history.replace('/brands')
      })
    } else {
      authenticate(user, (err, res) => {
        if(res.autenticated) this.props.history.replace('/brands')
        else {
          this.setState({
            msg: res.msg
          })
        }
      })
    }
  }

  removeMsg() {
    this.setState({
      msg: null
    })
  }

  render() {
    const { mode, msg } = this.state
    const title = mode === "LOGIN" ? "登录" : "注册"
    const signupMsg = mode === "SIGNUP" ? <FlashMessage props={{status: "warning", msg: "第一次登陆系统, 请先注册"}} /> : ""
    const errorMsg = msg ? <FlashMessage props={{status: "error", msg: msg}} /> : ""
    const bg_style = {
      backgroundImage: "linear-gradient(to right top, #607d8b, #607d8b, #607d8b, #607d8b, #607d8b)",
      minHeight: "100vh"
    };

    return (
      <div>
        <div style={bg_style}>
          <br/>
          <Link to="/"><h3 className="center white-text no-margin">时新汽配</h3></Link>
          <div className="container">
            <br/>
            <div className="row no-margin">
              <div className="col s12 m8 offset-m2">
                <div className="card r-box-shadow">
                  <div className="card-content">
                    <div className="row">
                      <div className="col s12 m10 offset-m1">
                        <h4 className="center">{title}</h4>
                        {signupMsg}
                        {errorMsg}
                        <Formik
                          initialValues={{ username: '', password: '', passwordCom: '' }}
                          onSubmit={(values, { setSubmitting }) => {
                            this.login(values);
                          }}
                          validationSchema={Yup.object().shape({
                            username: Yup.string()
                              .required('账号不能为空'),
                            password: Yup.string()
                              .min(6, '密码长度至少为6位')
                              .required('密码不能为空'),
                            passwordCom: Yup.string().oneOf([Yup.ref('password')], '前后密码不一致').required('请确认密码')
                          })}
                        >
                          {props => {
                            const {
                              touched,
                              errors,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                            } = props;
                            return (
                              <form onSubmit={handleSubmit}>
                                {errors.username && touched.username && <FlashMessage props={{status: "error", msg: errors.username}} />}
                                {errors.password && touched.password && <FlashMessage props={{status: "error", msg: errors.password}} />}
                                {mode === "SIGNUP" && errors.passwordCom && touched.passwordCom && <FlashMessage props={{status: "error", msg: errors.passwordCom}} />}

                                <div className="row no-margin">
                                  <div className="input-field col m12 s12">
                                    <input 
                                      type="text" 
                                      name="username" 
                                      id="username"
                                      ref={this.usernameInput}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      onFocus={this.removeMsg}
                                      className="validate"
                                    />
                                    <label htmlFor="username">账号 <span className="required">*</span></label>
                                  </div>
                                </div>

                                <div className="row no-margin">
                                  <div className="input-field col m12 s12">
                                    <input 
                                      type="password" 
                                      name="password" 
                                      id="password"
                                      ref={this.passwordInput}
                                      onChange={handleChange}
                                      onFocus={this.removeMsg}
                                      onBlur={handleBlur}
                                      className="validate"
                                    />
                                    <label htmlFor="password">密码 <span className="required">*</span></label>
                                  </div>
                                </div>

                                {
                                  mode === "SIGNUP" ?
                                  <div className="row no-margin">
                                    <div className="input-field col m12 s12">
                                      <input 
                                        type="password" 
                                        name="passwordCom" 
                                        id="passwordCom"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="validate"
                                      />
                                      <label htmlFor="passwordCom">再次输入密码 <span className="required">*</span></label>
                                    </div>
                                  </div> : ""
                                }

                                <br/>
                                <div className="row no-margin">
                                  <div className="input-field col m12 s12">
                                    {
                                      mode === "SIGNUP" && errors.passwordCom && touched.passwordCom ?
                                      <button type="button" disabled className="btn">{title}</button>
                                      :
                                      <button type="submit" onClick={this.login} className="btn">{title}</button>
                                    }
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

        </div>
      </div>
    )
  }
}

export default LoginForm