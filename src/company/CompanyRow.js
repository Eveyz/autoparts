import React from 'react'

import { Link } from 'react-router-dom'

class CompanyRow extends React.Component {
  constructor(props) {
    super(props)

    this.edit = this.edit.bind(this)
  }

  edit = (company) => (e) => {
    this.props.editMode(company)
  }

  render() {
    const { company } = this.props
    return(
      <tr className="small-td-padding">
        <td><Link to={`/companies/${this.props.company._id}`} replace>{company.name}</Link></td>
        <td>{company.address}</td>
        <td>{company.phone}</td>
        <td>
          <button type="button" className="btn blue bold" onClick={this.edit(company)}>编辑</button>
        </td>
      </tr>
    )
  }
}

export default CompanyRow