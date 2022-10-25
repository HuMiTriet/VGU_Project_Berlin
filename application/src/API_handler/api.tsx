import axios from 'axios'
const httpPort = '3001'
const httpHost = `localhost:${httpPort}`
const httpsPort = '3002'
const httpsHost = `localhost:${httpsPort}`
axios.defaults.headers.common = {
  'x-api-key': 'c8caa01f-df2d-4be7-99d4-9e8ab0f370e0',
  'Content-Type': 'application/json',
  Accept: '*/*'
}

async function getAssets(): Promise<string> {
  const assetsResponse = await axios.get(`http://${httpHost}/api/assets/getAll`)
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
    `http://${httpHost}/api/assets/create`,
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
    `http://${httpHost}/api/assets/delete${query}`
  )
  const data = deleteAssetsResponse.data
  console.log(data)
  return JSON.stringify(data)
}

async function readAsset(assetID: string): Promise<string> {
  const query = `?assetID=${assetID}`
  const readAssetRequest = await axios.get(
    `http://${httpHost}/api/assets/read${query}`
  )
  const data = readAssetRequest.data
  const assetRead = JSON.stringify(data)
  console.log(assetRead)
  return assetRead
}

export { getAssets, createAsset, deleteAsset, readAsset }
