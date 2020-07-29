import React from 'react'
import { brandChinese } from '../utils'
const Log = (props) => (
  <tr>
    <td>{props.log.date}</td>
    <td>{brandChinese[props.log.part_brand]}</td>
    <td>{props.log.part_name}</td>
    <td className={props.log.type === "in" ? "green-text" : "red-text"}>{props.log.type === "in" ? "入" : "出"}</td>
    <td>{props.log.quantity}</td>
    <td>{props.log.price}</td>
  </tr>
)

export default Log