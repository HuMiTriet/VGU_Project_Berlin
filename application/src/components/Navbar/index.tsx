import { signOut } from 'firebase/auth'
import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase'
import {
  Nav,
  NavLink,
  NavMenu,
  Bars,
  NavBtn,
  NavBtnLink
} from './NavbarElements'

const Navbar = () => {
  const [user, loading] = useAuthState(auth)
  console.log(user)

  useEffect(() => {
    loading
  })
  let LoginLogoutBtn: JSX.Element
  if (!user) {
    LoginLogoutBtn = (
      <NavBtn>
        <NavBtnLink to="/login">Log In</NavBtnLink>
      </NavBtn>
    )
  } else {
    LoginLogoutBtn = (
      <NavBtn>
        <NavBtnLink to="/" onClick={() => signOut(auth)}>
          Log Out
        </NavBtnLink>
      </NavBtn>
    )
  }
  return (
    <>
      <Nav>
        <NavLink to="/">
          <h1>REAL AS-STATED</h1>
        </NavLink>
        <Bars />
        <NavMenu>
          <NavLink to="/about" activeStyle>
            About
          </NavLink>
          <NavLink to="/services" activeStyle>
            Services
          </NavLink>
          <NavLink to="/contact-us" activeStyle>
            Contact Us
          </NavLink>
          <NavLink to="/sign-up" activeStyle>
            Sign Up
          </NavLink>
        </NavMenu>
        {LoginLogoutBtn}
      </Nav>
    </>
  )
}

export default Navbar
