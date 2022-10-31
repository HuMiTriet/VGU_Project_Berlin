import React from 'react'
import Navbar from '../../components/Navbar'

function Profile() {
  const userName = 'Dan Duong'
  const userID = '590x2359023857203cfr3'
  return (
    <>
      <Navbar />
      <div className="Profile">
        <h1>User Profile</h1>
        <div className="profile-info-basic">
          <h2>{userName}</h2>
          <p>{userID}</p>
        </div>
      </div>
    </>
  )
}

export default Profile
