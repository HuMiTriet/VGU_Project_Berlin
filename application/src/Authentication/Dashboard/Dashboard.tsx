import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'
import { auth, db, logout } from '../../firebase'
import { query, collection, getDocs, where } from 'firebase/firestore'
import { getAssets } from '../../API_handler/api'

function Dashboard() {
  const [user, loading, error] = useAuthState(auth)
  const [name, setName] = useState('')
  const [assetID, setAssetID] = useState('')
  const navigate = useNavigate()
  const getAllAssets = async () => {
    setAssetID(await getAssets())
  }
  // const fetchUserName = async () => {
  //   try {
  //     const q = query(collection(db, 'users'), where('uid', '==', user?.uid))
  //     const doc = await getDocs(q)
  //     const data = doc.docs[0].data()
  //     setName(data.name)
  //     asset = await getAssets()
  //   } catch (err) {
  //     console.error(err)
  //     alert('An error occured while fetching user data')
  //   }
  // }
  let asset: string
  const [isShown, setIsShown] = useState(false)
  const handleGetAssets = async () => {
    getAllAssets()
    setIsShown(current => !current)
  }

  useEffect(() => {
    if (loading) return
    if (!user) return navigate('/')
    // fetchUserName()
  }, [user, loading])
  return (
    <div className="dashboard">
      <div className="dashboard__container">
        Logged in as
        <div>{name}</div>
        <div>{user?.email}</div>
        <button className="dashboard__btn" onClick={logout}>
          Logout
        </button>
        <button className="getAsset" onClick={handleGetAssets}>
          {!isShown && 'Show Asset'}
          {isShown && 'Hide Asset'}
        </button>
        <div>
          {isShown && <div>AssetID {assetID}</div>}
          {/* 👇️ show component on click */}
          {!isShown && <div></div>}
        </div>
      </div>
    </div>
  )
}
export default Dashboard
