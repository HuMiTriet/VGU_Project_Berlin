import Navbar from '../components/Navbar'
// eslint-disable-next-line import/no-unresolved
import Homepage_House from '../assets/Homepage_House1.jpg'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'

function Home() {
  const [user, loading] = useAuthState(auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/dashboard')
    else navigate('/')
  }, [user, loading])
  return (
    <>
      <Navbar />
      <div className="body-homepage">
        <h1>Buy And Sell Your Property Without Commissions</h1>
        <img
          src={Homepage_House}
          className="HomepageHouse"
          style={{
            width: '50vw',
            height: '100vh',
            objectFit: 'cover',
            float: 'right'
          }}
          alt="house"
        />
      </div>
    </>
  )
}

export default Home
