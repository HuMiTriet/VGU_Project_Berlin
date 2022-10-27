import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
<<<<<<< HEAD
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
=======
// import Home from './pages/Home'
// import Contract from './pages/Contract/Contract'
// import Dashboard from './pages/Dashboard/Dashboard'
// import TestDashboard from './DashboardTest/Dashboard'
// import Login from './Authentication/Login/Login'
import PropertyDetail from "./pages/PropertyDetail/PropertyDetail"
>>>>>>> 7a58cea01e868cc03478f38f5fa0cc5c9b62c1c4

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
<<<<<<< HEAD
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
=======
          <Route path="/" element={<PropertyDetail />} />
          {/* <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboardtest" element={<TestDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/propertyinfo" element={<PropertyInfo />} />
          <Route path="/contract" element={<Contract />} /> */}
>>>>>>> 7a58cea01e868cc03478f38f5fa0cc5c9b62c1c4
        </Routes>
      </Router>
    </div>
  )
}

export default App