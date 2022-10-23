import axios from 'axios'
const port = '3001'
const host = `localhost:${port}`
axios.defaults.headers.common = {
  'X-API-Key': '', // can use userID as API key
  'Content-Type': 'application/json'
}

async function getAssets(): Promise<string> {
  const assetsResponse = await axios.get(`http://${host}/api/assets/getAll`)
  const data = assetsResponse.data
  console.log(JSON.parse(JSON.stringify(data)))
  return JSON.stringify(data)
}

async function createAsset(
  assetID: string,
  roomList: string,
  area: string,
  location: string,
  owners: string
): Promise<string> {
  const assetData = {
    assetID: assetID,
    roomList: roomList,
    area: area,
    location: location,
    owners: owners
  }
  const createAssetsResponse = await axios.post(
    `http://${host}/api/assets/create`,
    assetData
  )
  const data = createAssetsResponse.data
  const status = createAssetsResponse.status
  console.log(status)
  console.log(data)

  return status.toString()
}

async function deleteAsset(assetID: string): Promise<string> {
  const query = `?assetID=${assetID}`
  const deleteAssetsResponse = await axios.delete(
    `http://${host}/api/assets/delete${query}`
  )
  const data = deleteAssetsResponse.data
  console.log(data)
  return JSON.stringify(data)
}

async function readAsset(assetID: string): Promise<string> {
  const query = `?assetID=${assetID}`
  const readAssetRequest = await axios.get(
    `http://${host}/api/assets/read${query}`
  )
  const data = readAssetRequest.data
  const assetRead = JSON.stringify(data)
  console.log(assetRead)
  return assetRead
}

export { getAssets, createAsset, deleteAsset, readAsset }
