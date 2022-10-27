import Navbar from "../../components/Navbar";
import './InfoUpload.css'
import { Form, Input, Button, Select, Col, Row, Card, Upload, Typography} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
const { TextArea } = Input;



const normFile = (e: any) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};


const InfoUpload = (props) => {

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
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

            <Row >
              <Col span={12}>
                <Form onFinish={(values) => {
                  console.log({ values });
                  }}
                  onFinishFailed={(error) => {
                  console.log({ error });
                  }} initialValues={{ remember: true }}>

                  <h3>Number of Rooms</h3>
                  <Form.Item
                    name="number of rooms"
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

                  <h3>Description</h3>
                  <Form.Item>
                    <TextArea rows={4} />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary">
                      Confirm
                    </Button>
                  </Form.Item>
                </Form>
              </Col>

              <Col span={12}>
                <Form onFinish={(values) => {
                  console.log({ values });
                  }}
                  onFinishFailed={(error) => {
                  console.log({ error });
                  }} initialValues={{ remember: true }}>
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
                      name="terrace area"
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
                      name="balcony area"
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

                  <h3>Upload File</h3>         
                  <Form.Item name="upload file" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                    <Upload.Dragger name="files" action="/upload.do">
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">Click or drag file to this area to upload</p>
                      <p className="ant-upload-hint">Support for a single or bulk upload.</p> 
                    </Upload.Dragger>
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