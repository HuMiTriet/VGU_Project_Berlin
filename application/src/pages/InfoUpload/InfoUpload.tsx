import Navbar from "../../components/Navbar";
import './InfoUpload.css'
import { Form, Input, Button, Select, Col, Row, Card, Upload, Typography} from 'antd';
const { TextArea } = Input;



const normFile = (e: any) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};


const InfoUpload = () => {

  const onFinish = (value: any) => {
    console.log('Received values of form: ', value);
  };


  return (
  <> <Navbar/> 
    <Row justify='center'>
      <div id="upload" className="block contactBlock">
        <Card bodyStyle={{ backgroundColor: '#F3F3FA'}} style={{borderRadius: "20px", overflow: "hidden", width: 900}}>
          <div className="container-fluid">

            <div className="titleHolder">
              <Typography>
                <h1>Upload</h1>
              </Typography>
            </div>

            <Form onFinish={(value) => {
              console.log({ value });
              }}
              onFinishFailed={(error) => {
              console.log({ error });
              }} >
                    
                <Row >
                  <Col span={12}>

                      <h3>Tier List</h3>
                      <Form.Item name = "tier" rules={[{ required: true, message: 'Tier list is required' }]}>
                        <Select placeholder="Tier List">  
                            <Select.Option value="tier1">Tier 1</Select.Option>
                            <Select.Option value="tier2">Tier 2</Select.Option>
                            <Select.Option value="tier3">Tier 3</Select.Option>
                        </Select>
                      </Form.Item>

                      <h3>Price</h3>
                        <Form.Item
                          name="price"
                          rules={[
                            {
                              type: 'string',
                              message: 'The input is not valid',
                            },
                            { 
                              required: true,
                              message: 'Please enter the Price!' 
                            }]
                          }
                        >
                          <Input placeholder="Price" />
                        </Form.Item>

                      <h3>Number of Rooms</h3>
                      <Form.Item
                        name="rooms"
                        rules={[
                          {
                            type: 'string',
                            message: 'The input is not valid',
                          },
                          { 
                            required: true,
                            message: 'Please enter Number of Rooms!' 
                          }]
                        }
                      >
                        <Input placeholder="Number of Rooms" />
                      </Form.Item>

                      <h3>Floors</h3>
                      <Form.Item
                        name="floors"
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
                    
                  </Col>

                  <Col span={12}>  

                        <h3>Area</h3>
                        <Form.Item
                          name="area"
                          rules={[
                            {
                              type: 'string',
                              message: 'The input is not valid',
                            },
                            {
                              required: true,
                              message: 'Please input Area!',
                            },
                          ]}
                        >
                          <Input placeholder="Area"/>
                        </Form.Item>
                        
                        <h3>Terrace Area</h3>
                        <Form.Item
                          name="terraceArea"
                          rules={[
                            {
                              type: 'string',
                              message: 'The input is not valid',
                            },
                            {
                              required: true,
                              message: 'Please input Terrace Area!',
                            },
                          ]}
                        >
                          <Input placeholder="Terrace Area"/>
                        </Form.Item>

                        <h3>Balcony Area</h3>
                        <Form.Item
                          name="balconyArea"
                          rules={[
                            {
                              type: 'string',
                              message: 'The input is not valid',
                            },
                            {
                              required: true,
                              message: 'Please input Balcony Area!',
                            },
                          ]}
                        >
                          <Input placeholder="Balcony Area"/>
                        </Form.Item>
                        
                        <h3>Description</h3>
                      <Form.Item name= "description">
                        <TextArea rows={4} />
                      </Form.Item>


                    
                  </Col>
                </Row>
                  <div >
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Confirm
                    </Button>
                  </Form.Item>
                  </div>
            </Form>
          </div>
        </Card>
      </div>
    </Row>
  </>
  );
}

export default InfoUpload;