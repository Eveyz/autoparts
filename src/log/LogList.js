import React from 'react'

import Log from './Log'

const LogList = (props) => (
  props.data.length > 0 ?
  <table>
    <thead>
      <tr>
        <th>日期</th>
        <th>厂商</th>
        <th>配件名</th>
        <th>出入库</th>
        <th>数量</th>
        <th>单价(元)</th>
      </tr>
    </thead>

    <tbody>
      {
        props.data.map((log, idx) => {
          return <Log key={idx} log={log} />
        })
      }
    </tbody>
  </table>
  :
  <div className="card no-margin">
    <div className="card-content">
      <h5 className="center">出入库记录为空</h5>
    </div>
  </div>
)

export default LogList