import React from 'react'

import Header from '../layouts/Header'
import Company from './Company'

class CompanyContainer extends React.Component {
  render() {
    return(
      <div>
        <Header />
        <Company match={this.props.match} />
      </div>
    )
  }
}

export default CompanyContainer