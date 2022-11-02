import Navbar from '../../components/Navbar'
import { v4 as uuidv4 } from 'uuid'
import * as api from '../../API_handler/api'
import './InfoUpload.css'
import {
  Form,
  Input,
  Button,
  Select,
  Col,
  Row,
  Card,
  Upload,
  Typography
} from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { RoomType } from '../../resources/roomType'
import { Ownership } from '../../resources/ownership'
const { TextArea } = Input

const normFile = (e: any) => {
  console.log('Upload event:', e)
  if (Array.isArray(e)) {
    return e
  }
  return e?.fileList
}

const InfoUpload = () => {
  return (
    <>
      {' '}
      <Navbar />
      <Row justify="center">
        <div id="upload" className="block contactBlock">
          <Card
            bodyStyle={{ backgroundColor: '#F3F3FA' }}
            style={{ borderRadius: '20px', overflow: 'hidden', width: 900 }}
          >
            <div className="container-fluid">
              <div className="titleHolder">
                <Typography>
                  <h1>Upload</h1>
                </Typography>
              </div>

              <Row justify="center">
                <Col span={12}>
                  <Form
                    onFinish={async value => {
                      const re = /^[0-9\b]+$/
                      // console.log(re.test(value['price']))
                      const sellPercentage = value['sellpercentage']

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
                        const uuid = uuidv4()
                        const name = value['name']
                        const area = value['area']
                        const location = value['location']
                        const membershipThreshold = value['tier']

                        const roomType: RoomType = {
                          numOfBedroom: parseInt(value['bedrooms']),
                          numOfLivingroom: parseInt(value['livingrooms']),
                          numOfBathroom: parseInt(value['bathrooms']),
                          numOfDiningroom: parseInt(value['diningrooms'])
                        }

                        const owners: Ownership[] = [
                          {
                            ownerID: localStorage['userID'],
                            ownershipPercentage: 100,
                            sellPercentage: sellPercentageInt,
                            sellPrice: priceInt,
                            sellThreshold: 5,
                            isSeller: true
                          }
                        ]

                        const roomTypeString = JSON.stringify(roomType)
                        const ownersString = JSON.stringify(owners)

                        // console.log(uuid)
                        // console.log(name)
                        // console.log(roomTypeString)

                        // console.log(area)
                        // console.log(location)
                        // console.log(ownersString)

                        // console.log(membershipThreshold)

                        try {
                          await api.createRealEstate(
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
                    <h3>Tier</h3>
                    <Form.Item
                      name="tier"
                      rules={[
                        { required: true, message: 'Tier list is required' }
                      ]}
                    >
                      <Select placeholder="Tier">
                        <Select.Option value="0">Bronze [0]</Select.Option>
                        <Select.Option value="5">Silver [5]</Select.Option>
                        <Select.Option value="25">Gold [25]</Select.Option>
                        <Select.Option value="70">Platinum [70]</Select.Option>
                        <Select.Option value="100">Deluxe [100]</Select.Option>
                      </Select>
                    </Form.Item>

                    <h3>Name</h3>
                    <Form.Item
                      name="name"
                      rules={[
                        {
                          type: 'string',
                          message: 'The input is not valid'
                        },
                        {
                          required: true,
                          message: 'Please input Name!'
                        }
                      ]}
                    >
                      <Input placeholder="Name" />
                    </Form.Item>

                    <h3>Price</h3>
                    <Form.Item
                      name="price"
                      rules={[
                        {
                          type: 'string',
                          message: 'The input is not valid'
                        },
                        {
                          required: true,
                          message: 'Please enter the Price!'
                        }
                      ]}
                    >
                      <Input placeholder="Price" />
                    </Form.Item>

                    <h3>Sell percentage</h3>
                    <Form.Item
                      name="sellpercentage"
                      rules={[
                        {
                          type: 'string',
                          message: 'The input is not valid'
                        },
                        {
                          required: true,
                          message: 'Please enter the sell percentage!'
                        }
                      ]}
                    >
                      <Input placeholder="Sell percentage" />
                    </Form.Item>

                    <h3>Location</h3>
                    <Form.Item
                      name="location"
                      rules={[
                        {
                          type: 'string',
                          message: 'The input is not valid'
                        },
                        {
                          required: true,
                          message: 'Please input the location!'
                        }
                      ]}
                    >
                      <Input placeholder="Location" />
                    </Form.Item>
                    <h3>Area</h3>
                    <Form.Item
                      name="area"
                      rules={[
                        {
                          type: 'string',
                          message: 'The input is not valid'
                        },
                        {
                          required: true,
                          message: 'Please input Area!'
                        }
                      ]}
                    >
                      <Input placeholder="Area" />
                    </Form.Item>

                    <h3>Number of living rooms</h3>
                    <Form.Item
                      name="livingrooms"
                      rules={[
                        {
                          type: 'string',
                          message: 'The input is not valid'
                        },
                        {
                          required: true,
                          message: 'Please enter Number of living rooms!'
                        }
                      ]}
                    >
                      <Input placeholder="Number of living rooms" />
                    </Form.Item>

                    <h3>Number of bedrooms</h3>
                    <Form.Item
                      name="bedrooms"
                      rules={[
                        {
                          type: 'string',
                          message: 'The input is not valid'
                        },
                        {
                          required: true,
                          message: 'Please enter Number of bedrooms!'
                        }
                      ]}
                    >
                      <Input placeholder="Number of bedrooms" />
                    </Form.Item>

                    <h3>Number of bath rooms</h3>
                    <Form.Item
                      name="bathrooms"
                      rules={[
                        {
                          type: 'string',
                          message: 'The input is not valid'
                        },
                        {
                          required: true,
                          message: 'Please enter Number of bath rooms!'
                        }
                      ]}
                    >
                      <Input placeholder="Number of bath rooms" />
                    </Form.Item>

                    <h3>Number of dining rooms</h3>
                    <Form.Item
                      name="diningrooms"
                      rules={[
                        {
                          type: 'string',
                          message: 'The input is not valid'
                        },
                        {
                          required: true,
                          message: 'Please enter Number of dining rooms!'
                        }
                      ]}
                    >
                      <Input placeholder="Number of dining rooms" />
                    </Form.Item>

                    <h3>Description</h3>
                    <Form.Item name="description">
                      <TextArea rows={4} />
                    </Form.Item>

                    <h3>Upload File</h3>
                    <Form.Item
                      name="uploadFile"
                      valuePropName="fileList"
                      getValueFromEvent={normFile}
                      noStyle
                    >
                      <Upload.Dragger name="files" action="/upload.do">
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                          Click or drag file to this area to upload
                        </p>
                        <p className="ant-upload-hint">
                          Support for a single or bulk upload.
                        </p>
                      </Upload.Dragger>
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

export default InfoUpload
