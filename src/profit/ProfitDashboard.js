import React, { useState, useEffect } from 'react'
import Header from '../layouts/Header'
import { findOrders } from '../order/order_actions'
import Loading from '../layouts/Loading'
import { stats } from '../utils'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePie } from '@nivo/pie'
import M from 'materialize-css'

const ss = [
  {
    "id": "sass",
    "label": "sass",
    "value": 162,
    "color": "hsl(237, 70%, 50%)"
  },
  {
    "id": "make",
    "label": "make",
    "value": 314,
    "color": "hsl(135, 70%, 50%)"
  },
]

const ProfitDashboard = (props) => {

  const [profit, setProfit] = useState(null)
  const [brands, setBrands] = useState(null)
  const [year, setYear] = useState(null)
  const [years, setYears] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    M.AutoInit()
    findOrders({}, (err, orders) => {
      console.log(orders[0])
      // console.log(orders.length)
      let { _profit, _parts, _orders, _brands } = stats(orders)
      let _years = Object.keys(_profit).sort((a, b) => { return b - a })

      // profit
      let data = {}
      _years.forEach(y => {
        let months = Object.keys(_profit[y])
        data[y] = months.map(m => {
          return {
            "月份": `${m}月份`,
            "利润": _profit[y][m],
          }
        })
      })
      setProfit(data)

      // brand
      let brands_data = {}
      _years.forEach(y => {
        let brands = Object.keys(_brands[y])
        brands_data[y] = brands.map(b => {
          return {
            "id": b,
            "label": b,
            "value": _brands[y][b],
          }
        })
      })
      setBrands(brands_data)

      setYear(_years[0])
      setYears(_years)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    M.AutoInit()
  })

  const selectYear = (e) => {
    setYear(e.target.value)
  }

  const options = years.length > 0 ? years.map((y, idx) => {
    return <option key={idx} value={y}>{y}年</option>
  })
  :
  ""

  return (
    <div>
      <Header />
      {
        loading || !profit || !year ?
        <Loading />
        :
        <div className="container">
          <br/>
          <div className="row no-margin">
            <div className="input-field col s6 m6">
              <select 
                defaultValue={`${year}`} 
                onChange={selectYear}
              >
                  {options}
              </select>
              <label>选择年份</label>
            </div>
          </div>
          <div style={{height: "500px"}}>
            <h4>销售利润</h4>
            <ResponsiveBar
              data={profit[`${year}`]}
              keys={['利润']}
              indexBy="月份"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              colors={{ scheme: 'set3' }}
              defs={[
                {
                  id: 'dots',
                  type: 'patternDots',
                  background: 'inherit',
                  color: '#38bcb2',
                  size: 4,
                  padding: 1,
                  stagger: true
                },
                {
                  id: 'lines',
                  type: 'patternLines',
                  background: 'inherit',
                  color: '#eed312',
                  rotation: -45,
                  lineWidth: 6,
                  spacing: 10
                }
            ]}
            fill={[
              {
                match: {
                  id: 'fries'
                },
                id: 'dots'
              },
              {
                match: {
                  id: 'sandwich'
                },
                id: 'lines'
              }
            ]}
            borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '月份',
              legendPosition: 'middle',
              legendOffset: 32
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: `${year} 年`,
              legendPosition: 'middle',
              legendOffset: -50
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
            legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemOpacity: 1
                      }
                    }
                  ]
                }
            ]}
            animate={true}
            motionStiffness={90}
              motionDamping={15}
            />
          </div>
          <br/>
          <div style={{height: "500px"}}>
            <h4>品牌销量</h4>
            <ResponsivePie
              data={brands[`${year}`]}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors={{ scheme: 'accent' }}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
              radialLabelsSkipAngle={10}
              radialLabelsTextXOffset={6}
              radialLabelsTextColor="#333333"
              radialLabelsLinkOffset={0}
              radialLabelsLinkDiagonalLength={16}
              radialLabelsLinkHorizontalLength={24}
              radialLabelsLinkStrokeWidth={1}
              radialLabelsLinkColor={{ from: 'color' }}
              slicesLabelsSkipAngle={10}
              slicesLabelsTextColor="#333333"
              animate={true}
              motionStiffness={90}
              motionDamping={15}
              defs={[
                  {
                      id: 'dots',
                      type: 'patternDots',
                      background: 'inherit',
                      color: 'rgba(255, 255, 255, 0.3)',
                      size: 4,
                      padding: 1,
                      stagger: true
                  },
                  {
                      id: 'lines',
                      type: 'patternLines',
                      background: 'inherit',
                      color: 'rgba(255, 255, 255, 0.3)',
                      rotation: -45,
                      lineWidth: 6,
                      spacing: 10
                  }
              ]}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  translateY: 56,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: '#999',
                  symbolSize: 18,
                  symbolShape: 'circle',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: '#000'
                      }
                    }
                  ]
                }
              ]}
          />
          </div>
      </div>
      }
    </div>
  )
}

export default ProfitDashboard