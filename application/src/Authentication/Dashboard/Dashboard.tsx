import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'
import { auth, db, logout } from '../../firebase'
import { query, collection, getDocs, where } from 'firebase/firestore'
import { getAssets } from '../../API/api'

function Dashboard() {
  const [user, loading, error] = useAuthState(auth)
  const [name, setName] = useState('')
  const navigate = useNavigate()

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, 'users'), where('uid', '==', user?.uid))
      const doc = await getDocs(q)
      const data = doc.docs[0].data()

      setName(data.name)
    } catch (err) {
      console.error(err)
      alert('An error occured while fetching user data')
    }
  }

  const [isShown, setIsShown] = useState(false)

  let showAssetName = 'Show Asset'
  const handleGetAssets = event => {
    // 👇️ toggle shown state
    setIsShown(current => !current)
  }

  let asset: string = getAssets()
  useEffect(() => {
    if (loading) return
    if (!user) return navigate('/')

    fetchUserName()
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
          {isShown && <div>{asset}</div>}
          {/* 👇️ show component on click */}
          {!isShown && <div></div>}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
