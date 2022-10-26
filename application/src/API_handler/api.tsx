import axios from 'axios'
const httpPort = '3001'
const httpHost = `localhost:${httpPort}`
const assetPath = `http://${httpHost}/api/assets`
const userPath = `http://${httpHost}/api/users`
const realEstatePath = `http://${httpHost}/api/realestates`
// const httpsPort = '3002'
// const httpsHost = `localhost:${httpsPort}`
axios.defaults.headers.common = {
  'x-api-key': 'c8caa01f-df2d-4be7-99d4-9e8ab0f370e0',
  'Content-Type': 'application/json',
  Accept: '*/*'
}

async function getAllAssets(): Promise<string> {
  const assetsResponse = await axios.get(`${assetPath}/getAll`)
  const data = assetsResponse.data
  console.log(JSON.parse(JSON.stringify(data)))
  return JSON.stringify(data)
}

async function createRealEstate(
  assetID: string,
  roomList: string,
  area: string,
  location: string,
  owners: string,
  membershipScore: string
): Promise<string> {
  const assetData = {
    assetID: assetID,
    roomList: roomList,
    area: area,
    location: location,
    owners: owners,
    membershipScore: membershipScore
  }
  const createAssetsResponse = await axios.post(
    `${assetPath}/create`,
    assetData
  )
  const data = createAssetsResponse.data
  const status = createAssetsResponse.status
  console.log(status)
  console.log(data)
  return JSON.stringify(data)
}

async function updateRealEstate(
  assetID: string,
  roomList: string,
  area: string,
  location: string,
  owners: string,
  membershipScore: string
): Promise<string> {
  const assetData = {
    assetID: assetID,
    roomList: roomList,
    area: area,
    location: location,
    owners: owners,
    membershipScore: membershipScore
  }
  const createAssetsResponse = await axios.put(`${assetPath}/update`, assetData)
  const data = createAssetsResponse.data
  const status = createAssetsResponse.status
  console.log(status)
  console.log(data)
  return JSON.stringify(data)
}

async function deleteAsset(assetID: string): Promise<string> {
  const query = `?assetID=${assetID}`
  const deleteAssetsResponse = await axios.delete(`${assetPath}/delete${query}`)
  const data = deleteAssetsResponse.data
  console.log(data)
  return JSON.stringify(data)
}

async function readAsset(assetID: string): Promise<string> {
  const query = `?assetID=${assetID}`
  const readAssetResponse = await axios.get(`${assetPath}/read${query}`)
  const data = readAssetResponse.data
  console.log(data)
  return JSON.stringify(data)
}

async function createUser(assetID: string): Promise<string> {
  const body = {
    assetID: assetID,
    balance: '0'
  }
  const readAssetResponse = await axios.post(`${userPath}/create`, body)
  const data = readAssetResponse.data
  console.log(data)
  return JSON.stringify(data)
}

async function updateUser(assetID: string, balance: string): Promise<string> {
  const body = {
    assetID: assetID,
    balance: balance
  }
  const readAssetResponse = await axios.put(`${userPath}/update`, body)
  const data = readAssetResponse.data
  console.log(data)
  return JSON.stringify(data)
}

export {
  getAllAssets,
  createRealEstate,
  updateRealEstate,
  readAsset,
  deleteAsset,
  createUser,
  updateUser
}
