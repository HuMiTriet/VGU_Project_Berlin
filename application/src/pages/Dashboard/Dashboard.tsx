import Navbar from "../../components/Navbar";
import './Dashboard.css'
import { Tabs } from 'antd';
import AppFeature from './Feature';


function Dashboard() {
    return (
      <>
      <Navbar />
      <div id="feature">
        <div className="container-fluid">
          <div className="typeHouse">
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Duplex" key="1"> 
                <AppFeature/>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Triplex" key="2">
                <AppFeature/>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Land" key="3">
                <AppFeature/>
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </div>
      </>
    );
}

export default Dashboard;