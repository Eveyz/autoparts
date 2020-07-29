import React from 'react'

import CompanyRow from './CompanyRow'

class CompanyList extends React.Component {
  constructor(props) {
    super(props)
    this.editMode = this.editMode.bind(this)
  }

  editMode(company) {
    this.props.editMode(company)
  }

  render() {
    const companiesTable = this.props.data.length ?
    <table>
      <thead>
        <tr>
          <td>单位名</td>
          <td>单位地址</td>
          <td>单位电话</td>
          <td>编辑</td>
        </tr>
      </thead>
      <tbody>
        {
          this.props.data.map((company,idx) => {
            return <CompanyRow key={idx} editMode={this.editMode} company={company} />
          })
        }
      </tbody>
    </table>
    :
    <div className="card">
      <div className="card-content black-text">
        <h4 className="center">当前没有购货单位信息</h4>
      </div>
    </div>

    return(
      <div>
        {companiesTable}
      </div>
    )
  }
}

export default CompanyList