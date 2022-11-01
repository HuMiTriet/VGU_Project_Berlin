import './Profile.css'
import { Avatar } from '@mui/material'
import Navbar from '../../components/Navbar'
import ProfileImage from '../../assets/images/profile.jpg'
import CurrentBalance from '../../assets/images/balance.png'
import CurrentOrg from '../../assets/images/organization.png'
import Membership from '../../assets/images/membercard.png'
import { getAccountBalance, readAsset } from '../../API_handler/api'
import { useEffect, useState } from 'react'
import { User } from '../../resources/user'

function numberWithComma(number: string) {
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function Profile() {
  // const userName = 'Dan Duong'
  const userID = localStorage['userID']
  const [balance, setBalance] = useState('loading...')
  const [name, setName] = useState('loading...')
  const [membershipScore, setMembershipScore] = useState('loading...')

  const currentChannel = localStorage['channel']

  const getUserInfo = async () => {
    try {
      const responsePromise = readAsset(userID)
      const currentBalancePromise = getAccountBalance()
      const [response, currentBalance] = await Promise.all([
        responsePromise,
        currentBalancePromise
      ])
      const user: User = JSON.parse(response)
      setMembershipScore(String(user.membershipScore))
      setName(user.name)
      setBalance(currentBalance)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUserInfo()
  }, [])

  return (
    <>
      <Navbar />
      <div className="Profile">
        <h1>User Profile</h1>
        <div className="info-basic">
          <Avatar
            className="avatar"
            alt="User Image"
            src={ProfileImage}
            sx={{ width: 150, height: 150 }}
          />
          <p>
            <h2>{name}</h2>
            User ID: {userID}
          </p>
        </div>
        <div className="other-info">
          <div className="current-balance">
            {/* Thay hình Currywurst sau */}
            <img
              src={CurrentBalance}
              alt="Current Balance"
              style={{ height: '80px', width: '80px' }}
            />
            <p>
              <h3>Current Balance</h3>
              {numberWithComma(balance)}
            </p>
          </div>
          <div className="current-org">
            <img
              src={CurrentOrg}
              alt="Current Channel"
              style={{ height: '80px', width: '80px' }}
            />
            <p>
              <h3>Current Channel</h3>
              {currentChannel}
            </p>
          </div>
          <div className="membership">
            <img
              src={Membership}
              alt="Membership"
              style={{ height: '80px', width: '80px' }}
            />
            <p>
              <h3>Membership Score</h3>
              {membershipScore}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
