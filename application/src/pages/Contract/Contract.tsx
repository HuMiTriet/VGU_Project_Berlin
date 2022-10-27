import Navbar from "../../components/Navbar";
import './Contract.css'
import { Form, Input, Button, Checkbox, Select, Col, Row, Card, Alert, Typography} from 'antd';
import React, { useState } from 'react'
import * as api from '../../API_handler/api'



const Contact = () => {
  const [showAlert, setShowAlert] = useState(false);
  const onFinish = (e: unknown)=>{
    let id:string 
    let buyerID: string
    const buyPercentage:string = e['Buy Percentage']
    const [result, loadResult] = useState('')
    const transferRealEstateResult = function () {
      api
        .transferRealEstate(id, sellerID, buyerID, buyPercentage)
        .then(allData => {
          loadResult(allData)
          return
        })
        .catch((error: unknown) => {
          console.log(error)
        })
  }
  transferRealEstateResult()
    console.log(e);
    console.log(result)
    setTimeout(() => {
      setShowAlert(true);
    }, 500);
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

  const sellerID = `15705`
  const sellerOwnership = `70`
  const sellPercentage = `50`
  const noRemain = '5'

  const html = (
    <> <Navbar/> 
    <Row>
      <Col span={8} offset={12}>
      {showAlert&&
      <Alert 
          type="success"
          message="Transaction Completed Successfully"
          description="asdcsvsdv"
          closable
          showIcon
      />
      }
      </Col>
    </Row>
    
    <Row align='middle' justify='center'>
      <div id="contact" className="block contactBlock">
        <Card bodyStyle={{ backgroundColor: '#F3F3FA'}} style={{borderRadius: "20px", overflow: "hidden", width: 900}}>
        <div className="container-fluid">
          <div className="titleHolder">
            <Typography>
            <h1>Contract</h1>
            </Typography>
          </div>
          <Row >
            <Col span={12}>
            <Card bodyStyle={{ backgroundColor: '#fff' }} style={{borderRadius: "20px", overflow: "hidden", width: 300, stroke: '#657463'}}>
              <p>User: {sellerID}
                <br/>Own: {sellerOwnership}%
                <br/>Sell Percentage: {sellPercentage}%
                <br/>No remain less than: {noRemain}%
              </p>
            </Card>
            </Col>
            <Col span={12}>
          <Form onFinish = {onFinish} initialValues={{ remember: true }}>
            <div>
              <h3>Buy Percentage</h3>
              <Form.Item
                name="Buy Percentage"
                id='buyPer'
                rules={[
                  { 
                    required: true,
                    message: 'Please enter Buy Percentage!' 
                  }]
                }
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
                    message: 'Please input Total number!',
                  },
                ]}
              >
                <Input placeholder="Total"/>
              </Form.Item>
            </div>
            <div>
              <h3>Other Services</h3>
              <Form.Item name = "Other Services" rules={[{ required: true, message: 'Other Service is required', },]}>
                <Select placeholder="Cleaning">
                    <Select.Option value="Cleaning">Cleaning</Select.Option>
                    <Select.Option value="Insurance">Insurance</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div>
              <h3>Payment Method</h3>
              <Form.Item name = "Payment Method" rules={[{ required: true, message: 'Payment Method is required' }]}>
                <Select placeholder="One-Time-Payment">
                    <Select.Option value="One-Time-Payment">One-Time-Payment</Select.Option>
                    <Select.Option value="Installment">Installment</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <Form.Item>
              <Form.Item 
                name="remember" 
                valuePropName="checked"
                noStyle
                rules={[
                  { validator:(_, value) => value ? Promise.resolve() : Promise.reject('Should accept agreement') },
                ]}
              >
                <Checkbox>I have read and agree to Contract Terms and Agreement.</Checkbox>
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
  );

  
  return html
}

export default Contact;