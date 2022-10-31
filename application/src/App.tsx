// import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
// import Home from './pages/Home'
// import Contract from './pages/Contract/Contract'
// import Dashboard from './pages/Dashboard/Dashboard'
// import PropertyDetails from './pages/PropertyDetail/PropertyDetail'
// import InfoUpload from './pages/InfoUpload/InfoUpload'
import Profile from './pages/Profile/Profile'

export function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          {/* <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/propertyinfo" element={<PropertyDetails />} />
          <Route path="/contract" element={<Contract />} />
          <Route path="/infoupload" element={<InfoUpload />} /> */}
          <Route path="/" element={<Profile />} />
        </Routes>
      </Router>
    </div>
  )
}
