import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
//import Home from './pages/Home'
//import Upload from './pages/InfoUpload/InfoUpload'
//import Dashboard from './pages/Dashboard/Dashboard'
// import Login from './Authentication/Login/Login'
// import Dashboard from './Authentication/Dashboard/Dashboard'
// import Reset from './Authentication/Reset/Reset'
// import Register from './Authentication/Register/Register'
//import TestDashboard from './DashboardTest/Dashboard'
//import Contract from './pages/Contract/Contract'
import InfoUpload from './pages/InfoUpload/InfoUpload'
// import Home from './pages/Home'
// import Contract from './pages/Contract/Contract'
// import TestDashboard from './DashboardTest/Dashboard'
// import Login from './Authentication/Login/Login'
//import PropertyDetail from "./pages/PropertyDetail/PropertyDetail"
//import Home from './pages/Home'

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          {/*<Route path="/" element={<Home />} />
          <Route path="/" element={<Upload />} />
          */}
          <Route path="/" element={<InfoUpload />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="/" element={<Contract />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/reset" element={<Reset />} />
         */}
          
          {/* Order of pages
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboardtest" element={<TestDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/propertyinfo" element={<PropertyInfo />} /> */}
          {/* <Route path="/" element={<Home />} />
          <Route path="/" element={<PropertyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboardtest" element={<TestDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/propertyinfo" element={<PropertyInfo />} />
          <Route path="/contract" element={<Contract />} /> */}
        </Routes>
      </Router>
    </div>
  )
}

export default App