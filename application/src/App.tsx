import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
// import Login from './Authentication/Login/Login'
// import Dashboard from './Authentication/Dashboard/Dashboard'
// import Reset from './Authentication/Reset/Reset'
// import Register from './Authentication/Register/Register'

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/dashboard" element={<Dashboard />} /> */}
        </Routes>
      </Router>
    </div>
  )
}

export default App
