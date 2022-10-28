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
  if (!user) {
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
          <NavBtn>
            <NavBtnLink to="/login">Log In</NavBtnLink>
          </NavBtn>
        </Nav>
      </>
    )
  } else {
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
          <NavBtn>
            <NavBtnLink to="/" onClick={() => signOut(auth)}>
              Log Out
            </NavBtnLink>
          </NavBtn>
        </Nav>
      </>
    )
  }
}

export default Navbar
