import React from 'react'

import Header from '../layouts/Header'
import Loading from '../layouts/Loading'
import CompanyList from './CompanyList'
import CompanyForm from './CompanyForm'
import PaginationContainer from '../layouts/PaginationContainer'
import { createCompany, updateCompany, paginateCompanies, countCompanies } from './company_actions'

class CompanyListContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      mode: "VIEW",
      count: 0,
      companies: [],
      company: {}
    }

    this.addMode = this.addMode.bind(this)
    this.editMode = this.editMode.bind(this)
    this.cancel = this.cancel.bind(this)
    this.addCompany = this.addCompany.bind(this)
    this.updateCompany = this.updateCompany.bind(this)
    this.getCurrentPageData = this.getCurrentPageData.bind(this)
  }

  componentDidMount() {
    // findCompanies({}, (err, companies) => {
    //   this.setState((prevState, props) => ({
    //     isLoading: false,
    //     companies: companies
    //   }))
    // })
    countCompanies({}, (err, count) => {
      paginateCompanies({}, 0, 50, (err, companies) => {
        this.setState({
          count: count,
          isLoading: false,
          companies: companies
        })
      })
    })
  }

  addMode() {
    this.setState({
      mode: "ADD",
      company: {}
    })
  }

  editMode(company) {
    this.setState({
      mode: "EDIT",
      company: company
    })
  }

  cancel() {
    this.setState({
      mode: "VIEW",
      company: {}
    })
  }

  addCompany(company) {
    createCompany(company, (err, c) => {
      this.props.history.replace(`companies/${c._id}`)
    })
  }

  updateCompany(id, company) {
    updateCompany(id, company, (err, c) => {
      this.props.history.replace(`companies/${id}`)
    })
  }

  getCurrentPageData(skip) {
    paginateCompanies({}, skip, 50, (err, companies) => {
      this.setState({
        companies: companies
      })
    })
  }

  render() {
    const { isLoading, mode, companies, company, count } = this.state

    var content = 
    <div>
      <button className="btn btn-large" style={{"fontSize": "20px"}} onClick={this.addMode}><i className="material-icons left">add</i>添加购货单位</button>
      <PaginationContainer 
        itemsPerPage={30} 
        data={companies} 
        readOnly={true}
        total={count}
        getCurrentPageData={this.getCurrentPageData}
      >
        <CompanyList history={this.props.history} editMode={this.editMode} />
      </PaginationContainer>
    </div>

    if(mode === "ADD" || mode === "EDIT") content = <CompanyForm company={company} cancel={this.cancel} mode={mode} addCompany={this.addCompany} updateCompany={this.updateCompany} />

    return(
      <div>
        <Header />
        <div className="container">
          <br/>
          {
            isLoading ? <Loading /> : content
          }
        </div>
      </div>
    )
  }
}

export default CompanyListContainer