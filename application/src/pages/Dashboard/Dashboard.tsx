import { Tabs } from 'antd'
import { useEffect, useState } from 'react'
import * as api from '../../API_handler/api'
import Navbar from '../../components/Navbar'
import './Dashboard.css'
import AppFeature from './Feature'
function Dashboard() {
  const [allRealEstate, loadAllRealEstate] = useState('')
  const [isLoading, loading] = useState(true)
  const getAllAssets = function () {
    api
      .getAllRealEstate()
      .then(allRealEstates => {
        loadAllRealEstate(allRealEstates)
        console.log(allRealEstates)
        loading(false)
        return
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    getAllAssets()
  })
  if (isLoading) {
    return <div>Loading</div>
  }
  return (
    <>
      <Navbar />
      <div id="feature">
        <div className="container-fluid">
          <div className="typeHouse">
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Duplex" key="1">
                {AppFeature(allRealEstate)}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Triplex" key="2">
                {AppFeature(allRealEstate)}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Land" key="3">
                {AppFeature(allRealEstate)}
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
