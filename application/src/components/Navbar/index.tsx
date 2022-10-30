import { Radio, Switch } from 'antd'
// import FormControlLabel from '@mui/material/FormControlLabel'
import { signOut } from 'firebase/auth'
import React from 'react'
import { useEffect } from 'react'
import { FormGroup } from 'react-bootstrap'
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
// const labels = { inputProps: { channel: 'mychannel' } }
const label = { inputProps: { 'aria-label': 'Switch demo' } }
// const [checked, setChecked] = React.useState(true)
// const handleChange = event => {
//   setChecked(event.target.checked)
// }
const Navbar = () => {
  const [user, loading] = useAuthState(auth)
  console.log(user)

  useEffect(() => {
    loading
    // checked
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
        <Bars/>
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
        <Bars/>
        {LoginLogoutBtn}
        <Switch
          {...label}
          defaultChecked
          onChange={(e) => {
            if(e === true){
              localStorage.setItem('channel', 'mychannel')
            } else {
              localStorage.setItem('channel', 'business')
            }
            console.log(localStorage['channel'])
          }}
        />
        <div>
        <input type="radio" value="Org1" name="organization" onClick={(e: any) => {console.log(e.target.value);
        localStorage.setItem('apiKey', 'c8caa01f-df2d-4be7-99d4-9e8ab0f370e0')
        }}/> 1
        <input type="radio" value="Org2" name="organization" onClick={(e:any) => {console.log(e.target.value);
        localStorage.setItem('apiKey', 'e8ef8e47-7570-4165-8e87-c20bfd91fad1')
        }}/> 2
        <input type="radio" value="Org3" name="organization" onClick={(e: any) => {console.log(e.target.value);
        localStorage.setItem('apiKey', 'i9flae32-10dk-3849-1l44-19lqoexnveoq')
        }}/> 3
        <div></div>
      </div>
      </Nav>
    </>
  )
}

export default Navbar
