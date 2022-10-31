import { Switch } from 'antd'
import { signOut } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
//import { Form } from 'react-router-dom'
import { auth, signInWithGoogle } from '../../firebase'
import {
  Bars,
  Nav,
  NavBtn,
  NavBtnLink,
  NavLink,
  NavMenu
} from './NavbarElements'

import { Form, Input, Button, Select, Col, Row, Card } from 'antd'

const Navbar = () => {
  const [user, loading] = useAuthState(auth)
  useEffect(() => {
    loading
  })
  let LoginLogoutBtn: JSX.Element
  if (!user) {
    LoginLogoutBtn = (
      <NavBtn>
        <NavBtnLink
          onClick={() => {
            signInWithGoogle('1')
          }}
        >
          Log In
        </NavBtnLink>
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
  let currentOrgAfterRefresh: string
  if (localStorage['apiKey'] === 'c8caa01f-df2d-4be7-99d4-9e8ab0f370e0') {
    currentOrgAfterRefresh = 'Organization 1'
  } else if (
    localStorage['apiKey'] === 'e8ef8e47-7570-4165-8e87-c20bfd91fad1'
  ) {
    currentOrgAfterRefresh = 'Organization 2'
  } else if (
    localStorage['apiKey'] === 'i9flae32-10dk-3849-1l44-19lqoexnveoq'
  ) {
    currentOrgAfterRefresh = 'Organization 3'
  }

  return (
    <>
      <Nav>
        <NavLink to="/">
          <h1>REAL AS-STATED</h1>
        </NavLink>
        <Bars />

        <NavMenu>
          <NavLink to="/profile" activeStyle>
            Profile
          </NavLink>
          <NavLink to="/assetview" activeStyle>
            My Real Estate
          </NavLink>
          <NavLink to="/infoupload" activeStyle>
            Info Upload
          </NavLink>
        </NavMenu>
        <Bars />
        {LoginLogoutBtn}

        <div>
          <Form.Item>
            <Select
              defaultValue={localStorage['channel']}
              placeholder="Select Channel"
              onChange={(e: any) => {
                if (e === 'mychannel') {
                  localStorage.setItem('channel', 'mychannel')
                  // alert('Switched to mychannel channel')
                  window.location.reload()
                } else if (e === 'business') {
                  localStorage.setItem('channel', 'business')
                  // alert('Switched to business channel')
                  if (
                    localStorage['apiKey'] ===
                    'i9flae32-10dk-3849-1l44-19lqoexnveoq'
                  )
                    alert(
                      'Channel mychannel does not have Org 3, Switching to Org1'
                    )
                  localStorage.setItem(
                    'apiKey',
                    'c8caa01f-df2d-4be7-99d4-9e8ab0f370e0'
                  )
                  window.location.reload()
                }
              }}
            >
              <Select.Option value="mychannel">mychannel</Select.Option>
              <Select.Option value="business">business</Select.Option>
            </Select>
          </Form.Item>{' '}
        </div>
        <div>
          <Form.Item>
            <Select
              defaultValue={currentOrgAfterRefresh}
              placeholder="Select Organization"
              onChange={(e: any) => {
                if (e === 'Organization 1') {
                  localStorage.setItem(
                    'apiKey',
                    'c8caa01f-df2d-4be7-99d4-9e8ab0f370e0'
                  )
                  console.log('Changed to Organization 1')
                  window.location.reload()
                } else if (e === 'Organization 2') {
                  localStorage.setItem(
                    'apiKey',
                    'e8ef8e47-7570-4165-8e87-c20bfd91fad1'
                  )
                  console.log('Changed to Organization 2')
                  window.location.reload()
                } else if (e === 'Organization 3') {
                  if (localStorage['channel'] === 'business') {
                    alert(
                      'Organization 3 does not exist on channel Business, switching to Organization 1'
                    )
                    localStorage.setItem(
                      'apiKey',
                      'c8caa01f-df2d-4be7-99d4-9e8ab0f370e0'
                    )
                    console.log('Changed to Organization 1')
                    window.location.reload()
                    return
                  }
                  localStorage.setItem(
                    'apiKey',
                    'i9flae32-10dk-3849-1l44-19lqoexnveoq'
                  )
                  console.log('Changed to Organization 3')
                  window.location.reload()
                }
              }}
            >
              <Select.Option value="Organization 1">
                Organization 1
              </Select.Option>
              <Select.Option value="Organization 2">
                Organization 2
              </Select.Option>
              <Select.Option value="Organization 3">
                Organization 3
              </Select.Option>
            </Select>
          </Form.Item>
        </div>
      </Nav>
    </>
  )
}

export default Navbar
