import React, { useEffect, useState } from 'react'

import LogList from './LogList'
import { findLogs, countLogs, paginateLogs } from '../log/log_actions'
import Header from '../layouts/Header'
import PaginationContainer from '../layouts/PaginationContainer'
import Loading from '../layouts/Loading'

const LogContainer = (props) => {

  const [isLoading, setIsLoading] = useState(true)
  const [logs, setLogs] = useState([])
  const [count, setCount] = useState(0)

  useEffect(() => {
    countLogs({}, (err, count) => {
      setCount(count)
      paginateLogs({}, 0, 50, (err, logs) => {
        setLogs(logs)
        setIsLoading(false)
      })
    })
  }, [])

  const getCurrentPageData = (skip) => {
    paginateLogs({}, skip, 50, (err, logs) => {
      setLogs(logs)
    })
  }

  return(
    <div>
      <Header />
      <div className="container">
        <br/>
        <h5>出入库记录 ({count})</h5>
        {
          isLoading ? <Loading />
          :
          <PaginationContainer 
            itemsPerPage={50} 
            data={logs} 
            total={count} 
            readOnly={true}
            getCurrentPageData={getCurrentPageData}
          >
            <LogList />
          </PaginationContainer>
        }
      </div>
    </div>
  )
}

export default LogContainer