import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
<<<<<<< HEAD
//import Home from './pages/Home'
import Contact from './pages/Contract/Contract'
//import Upload from './pages/InfoUpload/InfoUpload'
//import Dashboard from './pages/Dashboard/Dashboard'
// import Login from './Authentication/Login/Login'
// import Dashboard from './Authentication/Dashboard/Dashboard'
// import Reset from './Authentication/Reset/Reset'
// import Register from './Authentication/Register/Register'
=======
import Home from './pages/Home'
import Contract from './pages/Contract/Contract'
import Dashboard from './pages/Dashboard/Dashboard'
import TestDashboard from './DashboardTest/Dashboard'
import Login from './Authentication/Login/Login'
>>>>>>> 7ba922381282edcd1ab403119168a00ef6fedc8a

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
<<<<<<< HEAD
          {/*<Route path="/" element={<Home />} />
          <Route path="/" element={<Upload />} />
          */}
          <Route path="/" element={<Contact />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/reset" element={<Reset />} />
         */}
          
          {/* Order of pages
=======
          <Route path="/" element={<Home />} />
>>>>>>> 7ba922381282edcd1ab403119168a00ef6fedc8a
          <Route path="/login" element={<Login />} />
          <Route path="/dashboardtest" element={<TestDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/propertyinfo" element={<PropertyInfo />} /> */}
          <Route path="/contract" element={<Contract />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
