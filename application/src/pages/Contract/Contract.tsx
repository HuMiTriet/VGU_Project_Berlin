import Navbar from "../../components/Navbar";
import './Contract.css'
import { Form, Input, Button, Checkbox, Select, Col, Row, Card, Alert, Typography} from 'antd';
import React, { useState } from 'react'


const Contract = () => {
  const [showAlert, setShowAlert] = useState(false);
  const onFinish = (e)=>{
    console.log(e);
    setTimeout(() => {
      setShowAlert(true);
    }, 500);
  }

  return (
  <> <Navbar/> 
      <Row>
        <Col span={8} offset={12}>
          {showAlert&&
          <Alert 
              type="success"
              message="Transaction Completed Successfully"
              description="asdcsvsdv"
              closable
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
                    <p>User: 161517
                      <br/>Own: 70%
                      <br/>Sell Percentage: 50%
                      <br/>No remain:
                    </p>
                  </Card>
                </Col>

                <Col span={12}>
                  <Form onFinish={(values) => {
                    console.log({ values });
                    }}
                    onFinishFailed={(error) => {
                    console.log({ error });
                    }}>

                    <div>
                      <h3>Buy Percentage</h3>
                      <Form.Item
                        name="Buy Percentage"
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
}

export default Contract;



