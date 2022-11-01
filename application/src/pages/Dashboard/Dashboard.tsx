import { Tabs } from 'antd'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import * as api from '../../API_handler/api'
import Navbar from '../../components/Navbar'
import { auth, db } from '../../firebase'
import './Dashboard.css'
import AppFeature from './Feature'
function Dashboard() {
  const [allRealEstate, loadAllRealEstate] = useState('')
  const [user] = useAuthState(auth)
  const [isLoading, setLoading] = useState(true)
  const getAllRealEstate = function () {
    api
      .getAllRealEstate()
      .then(allRealEstates => {
        loadAllRealEstate(allRealEstates)
        console.log(allRealEstates)
        setLoading(false)
        return
      })
      .catch(error => {
        console.log(error)
      })
  }

  const fetchId = async () => {
    try {
      const q = query(collection(db, 'users'), where('uid', '==', user?.uid))
      const doc = await getDocs(q)
      const data = doc.docs[0].data()
      //localStorage.setItem('userID', data.id)
      return
    } catch (err) {
      console.error(err)
      // alert('An error occured while fetching user data')
    }
  }
  useEffect(() => {
    getAllRealEstate()
    fetchId()
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
