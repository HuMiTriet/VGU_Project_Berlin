import React from 'react';
import './Dashboard.css'
import image from '../assets/images/Duplex.jpg';

import { Row, Col, Card, Pagination } from 'antd';

function AppFeature() {
  return (
    <div id="feature">
      <div className="container-fluid">
        <Row gutter={[16, 16]}>
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }}>
            <Card style={{borderRadius: "20px", overflow: "hidden"}} hoverable cover={<img alt="City Garden Duplex " src={image} />}>
            <div className="houseType">City Garden Duplex</div>
              <p>Ngo Tat To str., Binh Thanh Dist.
                <br/>100m2
                <div className="price">6.000.000.000 vnd</div>
              </p>
            </Card>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }}>
          <Card style={{borderRadius: "20px", overflow: "hidden"}} hoverable cover={<img alt="City Garden Duplex " src={image} />}>
              <div className="houseType">City Garden Duplex</div>
              <p>Ngo Tat To str., Binh Thanh Dist.
                <br/>100m2
                <div className="price">6.000.000.000 vnd</div>
              </p>
            </Card>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }}>
          <Card style={{borderRadius: "20px", overflow: "hidden"}} hoverable cover={<img alt="City Garden Duplex " src={image} />}>
              <div className="houseType">City Garden Duplex</div>
              <p>Ngo Tat To str., Binh Thanh Dist.
                <br/>100m2
                <div className="price">6.000.000.000 vnd</div>
              </p>
            </Card>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }}>
          <Card style={{borderRadius: "20px", overflow: "hidden"}} hoverable cover={<img alt="City Garden Duplex " src={image} />}>
              <div className="houseType">City Garden Duplex</div>
              <p>Ngo Tat To str., Binh Thanh Dist.
                <br/>100m2
                <div className="price">6.000.000.000 vnd</div>
              </p>
            </Card>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }}>
          <Card style={{borderRadius: "20px", overflow: "hidden"}} hoverable cover={<img alt="City Garden Duplex " src={image} />}>
              <div className="houseType">City Garden Duplex</div>
              <p>Ngo Tat To str., Binh Thanh Dist.
                <br/>100m2
                <div className="price">6.000.000.000 vnd</div>
              </p>
            </Card>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }}>
          <Card style={{borderRadius: "20px", overflow: "hidden"}} hoverable cover={<img alt="City Garden Duplex " src={image} />}>
              <div className="houseType">City Garden Duplex</div>
              <p>Ngo Tat To str., Binh Thanh Dist.
                <br/>100m2
                <div className="price">6.000.000.000 vnd</div>
              </p>
            </Card>
          </Col>
        </Row>
        <div className="paginationBlock"><Pagination defaultCurrent={1} total={50} /></div>
      </div>
    </div>
  );
}

export default AppFeature;
  