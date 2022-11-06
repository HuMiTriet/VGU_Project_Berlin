import Navbar from '../../components/Navbar'
import * as api from '../../API_handler/api'
import './EditAsset.css'
import { Form, Input, Button, Select, Col, Row, Card, Typography } from 'antd'
import { RoomType } from '../../resources/roomType'
import { Ownership } from '../../resources/ownership'
import { RealEstate } from '../../resources/realEstate'

// const realEstate: RealEstate = {
//   area: 500,
//   id: '93837437-e0a1-4d6b-b619-a631c35f7b7b',
//   location: 'Thu Dau Mot',
//   membershipThreshold: 5,
//   name: 'Hello',
//   owners: [
//     {
//       isSeller: true,
//       ownerID:
//         'x509::/C=US/ST=North Carolina/O=Hyperledger/OU=client/CN=minter::/C=US/ST=North Carolina/L=Durham/O=org1.example.com/CN=ca.org1.example.com',
//       ownershipPercentage: 100,
//       sellPercentage: 50,
//       sellPrice: 10000,
//       sellThreshold: 5
//     }
//   ],
//   roomList: {
//     numOfBathroom: 1,
//     numOfBedroom: 1,
//     numOfDiningroom: 1,
//     numOfLivingroom: 1
//   }
// }

let owner: Ownership

// const normFile = (e: any) => {
//   console.log('Upload event:', e)
//   if (Array.isArray(e)) {
//     return e
//   }
//   return e?.fileList
// }

/**
 * @author Huynh Minh Triet <17447@student.vgu.edu.vn> (UI and Integration), Dinh Minh Hoang, Thai Hoang Tam, Nguyen Khoa
 */
const EditAsset = () => {
  const realEstate: RealEstate = JSON.parse(localStorage['editRealEstate'])
  const ownerArray: Ownership[] = realEstate.owners
  const userID = localStorage['userID']
  for (const oneOwner of ownerArray) {
    if (oneOwner.ownerID === userID) {
      owner = oneOwner
      break
    }
  }
  return (
    <>
      {' '}
      <Navbar />
      <Row justify="center">
        <div id="Edit" className="block contactBlock">
          <Card
            bodyStyle={{ backgroundColor: '#F3F3FA' }}
            style={{ borderRadius: '20px', overflow: 'hidden', width: 900 }}
          >
            <div className="container-fluid">
              <div className="titleHolder">
                <Typography>
                  <h1>Edit</h1>
                </Typography>
              </div>

              <Row justify="center">
                <Col span={12}>
                  <Form
                    onFinish={async value => {
                      const re = /^[0-9\b]+$/
                      // console.log(re.test(value['price']))
                      const sellPercentage = value['sellpercentage']
                      console.log(value)

                      if (!re.test(sellPercentage)) {
                        alert('Sell percentage must be a positive integer')
                        return
                      }

                      const sellPercentageInt = parseInt(sellPercentage)

                      if (sellPercentageInt > 100) {
                        alert('Sell percentage must be less than 100')
                        return
                      }

                      const priceInt = parseInt(value['price'])

                      if (priceInt % 100 !== 0) {
                        alert('Price must be a multiple of 100')
                        return
                      } else {
                        console.log({ value })
                        const uuid = realEstate.id
                        const name = realEstate.name
                        const area = String(realEstate.area)
                        const location = realEstate.location
                        const membershipThreshold = String(
                          realEstate.membershipThreshold
                        )

                        const roomType: RoomType = realEstate.roomList

                        for (const oneOwner of ownerArray) {
                          if (oneOwner.ownerID === userID) {
                            oneOwner.sellPercentage = sellPercentageInt
                            oneOwner.sellPrice = priceInt
                            oneOwner.isSeller = value['isSelling']
                            break
                          }
                        }

                        const roomTypeString = JSON.parse(
                          JSON.stringify(roomType)
                        )
                        const ownersString = JSON.parse(
                          JSON.stringify(ownerArray)
                        )

                        try {
                          await api.updateRealEstate(
                            uuid,
                            name,
                            roomTypeString,
                            area,
                            location,
                            ownersString,
                            membershipThreshold
                          )
                        } catch (error) {
                          alert('Error: ' + error)
                          return
                        }

                        window.open('/dashboard', '_self')
                      }
                    }}
                    onFinishFailed={error => {
                      console.log({ error })
                    }}
                  >
                    <h3>Price</h3>
                    <Form.Item name="price">
                      <Input placeholder={owner.sellPrice.toString()} />
                    </Form.Item>

                    <h3>Sell percentage</h3>
                    <Form.Item name="sellpercentage">
                      <Input placeholder={owner.sellPercentage.toString()} />
                    </Form.Item>

                    <h3>Is selling ? </h3>
                    <Form.Item name="isSelling">
                      <Select defaultValue={owner.isSeller ? true : false}>
                        <Select.Option value={true}>Yes</Select.Option>
                        <Select.Option value={false}>No</Select.Option>
                      </Select>
                    </Form.Item>

                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Confirm
                      </Button>
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
            </div>
          </Card>
        </div>
      </Row>
    </>
  )
}

export default EditAsset
