import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
//import Home from './pages/Home'
import Contact from './pages/Contract/Contract'
import Dashboard from './pages/Dashboard/Dashboard'
// import Login from './Authentication/Login/Login'
// import Dashboard from './Authentication/Dashboard/Dashboard'
// import Reset from './Authentication/Reset/Reset'
// import Register from './Authentication/Register/Register'

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          {/*<Route path="/" element={<Home />} />*/}
          <Route path="/" element={<Contact />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/dashboard" element={<Dashboard />} /> */}

          {/* Order of pages
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/propertyinfo" element={<PropertyInfo />} />
          <Route path="/Contract" element={<Contract />} /> */}
        </Routes>
      </Router>
    </div>
  )
}

export default App
