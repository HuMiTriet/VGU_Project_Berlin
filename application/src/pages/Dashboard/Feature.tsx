import './Dashboard.css'
import Homepage_House from '../../assets/Homepage_House1.jpg'

import { Row, Col, Card, Pagination } from 'antd'
import { RealEstate } from '../../resources/realEstate'
import { Ownership } from '../../resources/ownership'
import { Link } from 'react-router-dom'

function numberWithComma(number: string) {
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function AppFeature(realEstates) {
  realEstates = JSON.parse(realEstates)
  const html = []
  realEstates.forEach(function (testRealEstate: RealEstate) {
    console.log(testRealEstate.id)

    let numberOfRoom = 0
    for (const key in testRealEstate.roomList) {
      numberOfRoom = numberOfRoom + parseInt(testRealEstate.roomList[key])
    }
    let prices: Array<number> = []
    testRealEstate.owners.forEach(function (owner: Ownership) {
      if (owner.isSeller) {
        prices.push(owner.sellPrice)
      }
    })
    prices = prices.sort((n1, n2) => n1 - n2)
    console.log(prices)

    let priceTag: JSX.Element
    if (prices.length !== 0) {
      if (prices[prices.length - 1] - prices[0] == 0) {
        priceTag = (
          <div className="price">
            {numberWithComma(prices[prices.length - 1].toString())} CW
          </div>
        )
      } else {
        priceTag = (
          <div className="price">
            {numberWithComma(prices[0].toString())} -{' '}
            {numberWithComma(prices[prices.length - 1].toString())} CW
          </div>
        )
      }
    }
    if (prices.length !== 0) {
      html.push(
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 12 }}>
          <Link to="/propertyinfo">
            <Card
              style={{ borderRadius: '20px', overflow: 'hidden' }}
              hoverable
              onClick={e => {
                localStorage.setItem('realEstateID', testRealEstate.id)
                localStorage.setItem('sellPriceMin', prices[0].toString())
                localStorage.setItem(
                  'sellPriceMax',
                  prices[prices.length - 1].toString()
                )
                localStorage.setItem(
                  'realEstate',
                  JSON.stringify(testRealEstate)
                )
                localStorage.setItem('numberOfRoom', numberOfRoom.toString())
                console.log(e)
              }}
              cover={<img alt="City Garden Duplex " src={Homepage_House} />}
            >
              <div className="houseType">{testRealEstate.name}</div>
              <p>
                {testRealEstate.location}
                <br />
                {testRealEstate.area} m<sup>2</sup>
                {priceTag}
              </p>
            </Card>
          </Link>
        </Col>
      )
    }
  })

  return (
    <div id="feature">
      <div className="container-fluid">
        <Row gutter={[16, 16]}>{html} </Row>
        <div className="paginationBlock">
          <Pagination defaultCurrent={1} total={50} />
        </div>
      </div>
    </div>
  )
}

export default AppFeature
