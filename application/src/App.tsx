// import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Contract from './pages/Contract/Contract'
import Dashboard from './pages/Dashboard/Dashboard'
import TestDashboard from './DashboardTest/Dashboard'
import Login from './Authentication/Login/Login'
import PropertyDetails from './pages/PropertyDetail/PropertyDetail'
import InfoUpload from './pages/InfoUpload/InfoUpload'

export function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/propertyinfo" element={<PropertyDetails />} />
          <Route path="/contract" element={<Contract />} />
          <Route path="/infoupload" element={<InfoUpload />} />
        </Routes>
      </Router>
    </div>
  )
}
