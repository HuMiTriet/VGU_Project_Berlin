import './Dashboard.css'
import Homepage_House from '../../assets/Homepage_House1.jpg'

import { Row, Col, Card, Pagination } from 'antd'
import { RealEstate } from '../../resources/realEstate'
import { Ownership } from '../../resources/ownership'

function AppFeature(realEstates) {
  realEstates = JSON.parse(realEstates)
  const html = []
  // realEstates: Array<RealEstate> = [
  //   {
  //     area: 300,
  //     id: 'asset1',
  //     location: 'Ben Cat 941',
  //     membershipThreshold: 0,
  //     owners: [
  //       {
  //         isSeller: true,
  //         ownerID: 'user2',
  //         ownershipPercentage: 100,
  //         sellPercentage: 50,
  //         sellPrice: 2000,
  //         sellThreshold: 5
  //       },
  //       {
  //         isSeller: true,
  //         ownerID: 'user1',
  //         ownershipPercentage: 100,
  //         sellPercentage: 50,
  //         sellPrice: 1000,
  //         sellThreshold: 5
  //       },
  //       {
  //         isSeller: true,
  //         ownerID: 'user1',
  //         ownershipPercentage: 100,
  //         sellPercentage: 10,
  //         sellPrice: 100000,
  //         sellThreshold: 5
  //       }
  //     ],
  //     roomList: {
  //       numOfBathroom: 2,
  //       numOfBedroom: 2,
  //       numOfDiningroom: 1,
  //       numOfLivingroom: 1
  //     }
  //   },
  //   {
  //     area: 400,
  //     id: 'asset2',
  //     location: 'Ben Cat 941',
  //     membershipThreshold: 0,
  //     owners: [
  //       {
  //         isSeller: true,
  //         ownerID: 'user2',
  //         ownershipPercentage: 100,
  //         sellPercentage: 50,
  //         sellPrice: 2000,
  //         sellThreshold: 5
  //       },
  //       {
  //         isSeller: true,
  //         ownerID: 'user1',
  //         ownershipPercentage: 100,
  //         sellPercentage: 50,
  //         sellPrice: 1000,
  //         sellThreshold: 5
  //       },
  //       {
  //         isSeller: true,
  //         ownerID: 'user1',
  //         ownershipPercentage: 100,
  //         sellPercentage: 10,
  //         sellPrice: 100000,
  //         sellThreshold: 5
  //       }
  //     ],
  //     roomList: {
  //       numOfBathroom: 2,
  //       numOfBedroom: 2,
  //       numOfDiningroom: 1,
  //       numOfLivingroom: 1
  //     }
  //   }
  // ]
  realEstates.forEach(function (testRealEstate: RealEstate) {
    console.log(testRealEstate.id)

    let prices: Array<number> = []
    testRealEstate.owners.forEach(function (value: Ownership) {
      const price = (value.sellPrice * 100) / value.sellPercentage
      if (!isNaN(price)) {
        prices.push(price)
      }
    })
    prices = prices.sort((n1, n2) => n1 - n2)

    html.push(
      <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }}>
        <Card
          style={{ borderRadius: '20px', overflow: 'hidden' }}
          hoverable
          cover={<img alt="City Garden Duplex " src={Homepage_House} />}
        >
          <div className="houseType">{testRealEstate.id}</div>
          <p>
            {testRealEstate.location}
            <br />
            {testRealEstate.area} m<sup>2</sup>
            <div className="price">
              {prices[0]} - {prices[prices.length - 1]} vnd
            </div>
          </p>
        </Card>
      </Col>
    )
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
