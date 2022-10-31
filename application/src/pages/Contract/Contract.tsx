import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Select,
  Typography
} from 'antd'
import { useState } from 'react'
import * as api from '../../API_handler/api'
import Navbar from '../../components/Navbar'
import './Contract.css'

/**
 * @author Nguyen Khoa, Thai Hoang Tam, Quang
 */
function Contract() {
  const [showAlert, setShowAlert] = useState(false)
  const [result, loadResult] = useState('')
  const buyerID = localStorage['userID']
  const realEstateID = localStorage['realEstateID']
  const sellerID = localStorage['sellerID']
  const ownershipPercentage = localStorage['ownershipPercentage']
  const sellPercentage = localStorage['sellPercentage']
  const sellThreshold = localStorage['sellThreshold']
  const sellPrice = localStorage['sellPrice']
  const transferRealEstateResult = function (buyPercentage, value) {
    api
      .transferRealEstate(realEstateID, sellerID, buyerID, buyPercentage, value)
      .then(allData => {
        loadResult(allData)
        return
      })
      .catch((error: any) => {
        console.log(error)
        alert(error.response.data.message)
      })
  }
  const onFinish = (e: unknown) => {
    const buyPercentage: string = e['Buy Percentage']

    // Check if buy Percentage is an integer
    const re = /^[0-9\b]+$/;
    console.log(re.test(buyPercentage))



    const value = (
      (parseInt(sellPrice) / 100) *
      parseInt(buyPercentage)
    ).toString()
    try {
      transferRealEstateResult(buyPercentage, value)
    } catch (err) {
      console.log(err)
    }
    console.log(e)
    console.log(result)
    setTimeout(() => {
      setShowAlert(true)
    }, 500)
  }

  // const [data, loadAllRealEstate] = useState('')
  // const getAssetsDetails = function () {
  //   api
  //     .readAsset('asset1')
  //     .then(allData => {
  //       loadAllRealEstate(allData)
  //       console.log(allData)
  //       return
  //     })
  //     .catch((error: unknown) => {
  //       console.log(error)
  //     })
  // }
  // console.log(data, 'neko')

  const html = (
    <>
      {' '}
      <Navbar />
      <Row>
        <Col span={8} offset={12}>
          {showAlert && (
            <Alert
              type="success"
              message="Transaction Completed Successfully"
              description="asdcsvsdv"
              closable
              showIcon
            />
          )}
        </Col>
      </Row>
      <Row align="middle" justify="center">
        <div id="contact" className="block contactBlock">
          <Card
            bodyStyle={{ backgroundColor: '#F3F3FA' }}
            style={{ borderRadius: '20px', overflow: 'hidden', width: 900 }}
          >
            <div className="container-fluid">
              <div className="titleHolder">
                <Typography>
                  <h1>Contract</h1>
                </Typography>
              </div>
              <Row>
                <Col span={12}>
                  <Card
                    bodyStyle={{ backgroundColor: '#fff' }}
                    style={{
                      borderRadius: '20px',
                      overflow: 'hidden',
                      width: 300,
                      stroke: '#657463'
                    }}
                  >
                    <p>
                      User: {sellerID}
                      <br />
                      Own: {ownershipPercentage}%
                      <br />
                      Sell Percentage: {sellPercentage}%
                      <br />
                      No remain less than: {sellThreshold}%
                      <br />
                      Sell Price (100%): {sellPrice} CW
                    </p>
                  </Card>
                </Col>
                <Col span={12}>
                  <Form
                    onFinish={e => {
                      onFinish(e)
                    }}
                    initialValues={{ remember: true }}
                  >
                    <div>
                      <h3>Buy Percentage</h3>
                      <Form.Item
                        name="Buy Percentage"
                        id="buyPer"
                        rules={[
                          {
                            required: true,
                            message: 'Please enter Buy Percentage!'
                          }
                        ]}
                      >
                        <Input placeholder="Buy Percentage" />
                      </Form.Item>
                    </div>
                    <div>
                      <h3>Total</h3>
                      <Form.Item
                        name="total"
                        rules={[
                          {
                            required: true,
                            message: 'Please input Total number!'
                          }
                        ]}
                      >
                        <Input placeholder="Total" />
                      </Form.Item>
                    </div>
                    <div>
                      <h3>Other Services</h3>
                      <Form.Item
                        name="Other Services"
                        rules={[
                          {
                            required: true,
                            message: 'Other Service is required'
                          }
                        ]}
                      >
                        <Select placeholder="Cleaning">
                          <Select.Option value="Cleaning">
                            Cleaning
                          </Select.Option>
                          <Select.Option value="Insurance">
                            Insurance
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </div>
                    <div>
                      <h3>Payment Method</h3>
                      <Form.Item
                        name="Payment Method"
                        rules={[
                          {
                            required: true,
                            message: 'Payment Method is required'
                          }
                        ]}
                      >
                        <Select placeholder="One-Time-Payment">
                          <Select.Option value="One-Time-Payment">
                            One-Time-Payment
                          </Select.Option>
                          <Select.Option value="Installment">
                            Installment
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </div>
                    <Form.Item>
                      <Form.Item
                        name="remember"
                        valuePropName="checked"
                        noStyle
                        rules={[
                          {
                            validator: (_, value) =>
                              value
                                ? Promise.resolve()
                                : Promise.reject('Should accept agreement')
                          }
                        ]}
                      >
                        <Checkbox>
                          I have read and agree to Contract Terms and Agreement.
                        </Checkbox>
                      </Form.Item>
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

  return html
}

export default Contract
