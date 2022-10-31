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
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import * as api from '../../API_handler/api'
import Navbar from '../../components/Navbar'
import { auth, db } from '../../firebase'
import './Contract.css'

/**
 * @author Nguyen Khoa, Thai Hoang Tam, Quang
 */
function Contract() {
  const [showAlert, setShowAlert] = useState(false)
  const [user, loading] = useAuthState(auth)
  const [idLoading, setLoading] = useState(true)
  const [buyerID, setID] = useState('')
  const realEstateID = localStorage['realEstateID']
  const sellerID = localStorage['sellerID']
  const ownershipPercentage = localStorage['ownershipPercentage']
  const sellPercentage = localStorage['sellPercentage']
  const sellThreshold = localStorage['sellThreshold']
  const sellPrice = localStorage['sellPrice']
  const fetchId = async () => {
    try {
      const q = query(collection(db, 'users'), where('uid', '==', user?.uid))
      const doc = await getDocs(q)
      const data = doc.docs[0].data()
      setID(data.realEstateID)
      setLoading(false)
      console.log(realEstateID)
    } catch (err) {
      console.error(err)
      // alert('An error occured while fetching user data')
    }
  }
  useEffect(() => {
    fetchId()
  })
  const onFinish = (e: unknown) => {
    // let realEstateID:string
    // let buyerID: string
    const buyPercentage: string = e['Buy Percentage']
    const value = (
      (parseInt(sellPrice) / 100) *
      parseInt(buyPercentage)
    ).toString()
    const [result, loadResult] = useState('')
    const transferRealEstateResult = function () {
      api
        .transferRealEstate(
          realEstateID,
          sellerID,
          buyerID,
          buyPercentage,
          value
        )
        .then(allData => {
          loadResult(allData)
          return
        })
        .catch((error: unknown) => {
          console.log(error)
        })
    }
    try {
      transferRealEstateResult()
    } catch (err) {
      // err box
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
                  <Form onFinish={onFinish} initialValues={{ remember: true }}>
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

  if (idLoading) {
    return <div>Loading</div>
  } else {
    return html
  }
}

export default Contract
