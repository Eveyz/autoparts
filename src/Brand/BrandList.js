import React from 'react'
import { Link } from 'react-router-dom'

import Header from '../layouts/Header'
import Toyota from '../images/toyota-logo.jpg'
import Nissan from '../images/nissan.jpg'
import Mit from '../images/mit.jpg'
import Honda from '../images/honda.jpg'

class BrandList extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <br/>
        <div className="container">
          <div className="row">
            <Link to="/brands/toyota">
              <div className="col m6 s12">
                <div className="card horizontal car-brand-logo">
                  <div className="card-image">
                    <img src={Toyota} alt="toyota-logo" />
                  </div>
                  <div className="card-stacked">
                    <div className="card-content blue-grey-text">
                      <span className="card-title black-text brand-list-font">丰田</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="/brands/nissan">
              <div className="col m6 s12">
                <div className="card horizontal car-brand-logo">
                  <div className="card-image">
                    <img src={Nissan} alt="nissan-logo" />
                  </div>
                  <div className="card-stacked">
                    <div className="card-content blue-grey-text">
                      <span className="card-title black-text brand-list-font">日产</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className="row">
            <Link to="/brands/mitsubishi">
              <div className="col m6 s12">
                <div className="card horizontal car-brand-logo">
                  <div className="card-image">
                    <img src={Mit} alt="mitsubishi-logo" />
                  </div>
                  <div className="card-stacked">
                    <div className="card-content blue-grey-text">
                      <span className="card-title black-text brand-list-font">三凌</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="/brands/honda">
              <div className="col m6 s12">
                <div className="card horizontal car-brand-logo">
                  <div className="card-image">
                    <img src={Honda} alt="honda-logo" />
                  </div>
                  <div className="card-stacked">
                    <div className="card-content blue-grey-text">
                      <span className="card-title black-text brand-list-font">本田</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default BrandList