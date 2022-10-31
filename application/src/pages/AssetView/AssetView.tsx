import './AssetView.css'
import AssetTable from '../../components/AssetTable/AssetTable'
import Navbar from '../../components/Navbar'

function AssetView() {
  return (
    <>
      <Navbar />
      <div className="asset-heading">
        <h1>Your Assets</h1>
      </div>
      <div className="asset-container">
        <AssetTable />
      </div>
    </>
  )
}

export default AssetView
