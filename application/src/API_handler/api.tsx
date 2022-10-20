import axios from 'axios'
const host = 'localhost'
async function getAssets(): Promise<string> {
  const assetsResponse = await axios.get(`http://${host}:3001/api/assets`)
  const data = assetsResponse.data
  return JSON.stringify(data)
}

async function createAsset(req): Promise<string> {
  const createAssetsRequest = await axios.post(
    `http://${host}:3001/api/assets?${req}`
  )
  const data = createAssetsRequest.data
  return JSON.stringify(data)
}

async function deleteAsset(req): Promise<string> {
  const deleteAssetsRequest = await axios.post(
    `http://${host}:3001/api/assets?${req}`
  )
  const data = deleteAssetsRequest.data
  return JSON.stringify(data)
}

async function readAsset(assetID: string): Promise<string> {
  const req = `?assetID=${assetID}`
  const readAssetRequest = await axios.get(
    `http://${host}:3001/api/assets/read${req}`
  )
  const data = readAssetRequest.data
  const assetRead = JSON.stringify(data)
  console.log(assetRead)
  return assetRead
}

export { getAssets, createAsset, deleteAsset, readAsset }
