import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  auth,
  logInWithEmailAndPassword,
  signInWithGoogle
} from '../../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import './Register.css'

function Register() {
  return (
    <div>
      <p>Register with Google</p>
    </div>
  )
}

export default Register
