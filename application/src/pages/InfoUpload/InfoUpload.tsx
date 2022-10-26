import Navbar from "../../components/Navbar";
import './InfoUpload.css'
import { Form, Input, Button, Select, Col, Row, Card} from 'antd';

const InfoUpload = () => {
  return (
    <> <Navbar/> 
    <Row align='middle' justify='center'>
    <div id="upload" className="block contactBlock">
      <Card bodyStyle={{ backgroundColor: '#F3F3FA'}} style={{borderRadius: "20px", overflow: "hidden", width: 900}}>
        <div className="container-fluid">
          <div className="titleHolder">
            <h2>Upload</h2>
          </div>
          <Row >
            <Col span={12}>
            
            </Col>
            <Col span={12}>
            <Form initialValues={{ remember: true }}>
              <div>
                <h3>Buy Percentage</h3>
                <Form.Item
                  name="Buy Percentage"
                  rules={[
                    {
                      type: 'string',
                      message: 'The input is not valid',
                    },
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
                      type: 'string',
                      message: 'The input is not valid',
                    },
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
              <Form.Item>
                <Select placeholder="Cleaning">
                    <Select.Option value="Cleaning">Cleaning</Select.Option>
                    <Select.Option value="Insurance">Insurance</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div>
              <h3>Payment</h3>
              <Form.Item>
                <Select placeholder="One-Time-Payment">
                    <Select.Option value="One-Time-Payment">One-Time-Payment</Select.Option>
                    <Select.Option value="Installment">Installment</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <Form.Item>
              <Button type="primary">
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

export default InfoUpload;