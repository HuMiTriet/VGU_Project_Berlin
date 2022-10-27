import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Contract from './pages/Contract/Contract'
import Dashboard from './pages/Dashboard/Dashboard'
import TestDashboard from './DashboardTest/Dashboard'
import Login from './Authentication/Login/Login'
import PropertyDetails from './pages/PropertyDetail/PropertyDetail'

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboardtest" element={<TestDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/propertyinfo" element={<PropertyDetails />} />
          <Route path="/contract" element={<Contract />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
