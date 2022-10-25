import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'
import { auth, db, logout } from '../firebase'
import { query, collection, getDocs, where } from 'firebase/firestore'
import {
  getAssets,
  readAsset,
  createAsset,
  deleteAsset
} from '../API_handler/api'

function Dashboard() {
  const [user, loading] = useAuthState(auth)
  const [name, setName] = useState('')
  const [allAssets, setAllAssets] = useState('')
  const [assetRead, setReadAsset] = useState('')
  const [assetID, setInputAssetID] = useState('')
  const navigate = useNavigate()
  // const fetchUserName = async () => {
  //   try {
  //     const q = query(collection(db, 'users'), where('uid', '==', user?.uid))
  //     const doc = await getDocs(q)
  //     const data = doc.docs[0].data()
  //     setName(data.name)
  //   } catch (err) {
  //     console.error(err)
  //     alert('An error occured while fetching user data')
  //   }
  // }
  const [isShown, setIsShown] = useState(false)
  const handleGetAssets = async () => {
    setAllAssets(await getAssets())
    setIsShown(current => !current)
  }

  const handleReadAsset = async (assetID: string) => {
    console.log('Read Asset')
    const asset = await readAsset(assetID)
    console.log(asset)
    setReadAsset(asset)
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
        <div>{user.uid}</div>
        <button className="dashboard__btn" onClick={logout}>
          Logout
        </button>
        <button className="getAsset" onClick={handleGetAssets}>
          {!isShown && 'Show Asset'}
          {isShown && 'Hide Asset'}
        </button>
        <div>
          {isShown && (
            <div>
              <div>All assets</div>
              <div>{allAssets}</div>
            </div>
          )}
          {!isShown && <div></div>}
        </div>
        <form>
          AssetID
          <input
            value={assetID}
            onInput={(e: any) => setInputAssetID(e.target.value)}
          ></input>
        </form>
        <button className="readAsset" onClick={() => handleReadAsset(assetID)}>
          Read Asset
        </button>
        <div>
          {
            <div>
              <div>Read assets</div>
              <div>{assetRead}</div>
            </div>
          }
        </div>
        <button
          className="createAsset"
          onClick={() =>
            createAsset(
              'asset209',
              JSON.stringify({
                numOfBathroom: '2',
                numOfBedroom: '2',
                numOfDiningroom: '2',
                numOfLivingroom: '1'
              }),
              '200',
              'Ben Cat',
              JSON.stringify([
                {
                  isSeller: 'true',
                  ownerID: 'user1',
                  ownershipPercentage: '100',
                  sellPercentage: '50',
                  sellPrice: '1000',
                  sellThreshold: '5'
                }
              ])
            )
          }
        >
          Create Asset
        </button>
        <form>
          Delete AssetID
          <input
            value={assetID}
            onInput={(e: any) => setInputAssetID(e.target.value)}
          ></input>
        </form>
        <button className="deleteAsset" onClick={() => deleteAsset(assetID)}>
          Delete Asset
        </button>
      </div>
    </div>
  )
}
export default Dashboard
