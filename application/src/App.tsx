// import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Contract from './pages/Contract/Contract'
import Dashboard from './pages/Dashboard/Dashboard'
import PropertyDetails from './pages/PropertyDetail/PropertyDetail'
import InfoUpload from './pages/InfoUpload/InfoUpload'
import Profile from './pages/Profile/Profile'
import AssetView from './pages/AssetView/AssetView'
import EditAsset from './pages/EditAsset/EditAsset'

export function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assetview" element={<AssetView />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/propertyinfo" element={<PropertyDetails />} />
          <Route path="/contract" element={<Contract />} />
          <Route path="/infoupload" element={<InfoUpload />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/editasset" element={<EditAsset />} />
        </Routes>
      </Router>
    </div>
  )
}
