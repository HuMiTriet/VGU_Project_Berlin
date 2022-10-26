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

const RED     = '\x1b[31m'
const GREEN   = '\x1b[32m'
const YELLOW  = '\x1b[33m'
const BLUE    = '\x1b[34m'
const MAGENTA = '\x1b[35m'
const CYAN    = '\x1b[36m'
const RESET   = '\x1b[0m'
/**
 * @author Nguyen Khoa
 */
function debug(color:string, msgString: string) {
  console.log(`${color}\n\t${msgString}${RESET}\n`)
}

/**
 * @author Thai Hoang Tam, Nguyen Khoa
 */
async function getAllAssets(): Promise<string> {
  console.log('Get all assets')
  const assetsResponse = await axios.get(`${assetPath}/getAll`)
  const data = assetsResponse.data
  console.log(JSON.parse(JSON.stringify(data)))
  return JSON.stringify(data)
}

/**
 * @author Nguyen Khoa
 */
async function getAllRealEstate(): Promise<string>{
  const realEstateResponse = await axios.get(`${realEstatePath}/getAll`)
  const data = realEstateResponse.data
  console.log(JSON.parse(JSON.stringify(data)))
  return JSON.stringify(data)
}

/**
 *  * Create new Real Estate
 * @author Thai Hoang Tam, Nguyen Khoa
 * @param id
 * @param roomList
 * @param area
 * @param location
 * @param owners
 * @param membershipThreshold
 */
async function createRealEstate(
  id: string,
  roomList: string,
  area: string,
  location: string,
  owners: string,
  membershipThreshold: string
): Promise<string> {
  const realEstateData = {
    id: id,
    roomList: roomList,
    area: area,
    location: location,
    owners: owners,
    membershipThreshold: membershipThreshold
  }
  const createRealEstateResponse = await axios.post(
    `${realEstatePath}/create`,
    realEstateData
  )
  const data = createRealEstateResponse.data
  const status = createRealEstateResponse.status
  debug(GREEN,`createRealEstate:\n\t- Status: ${status}\n\t- Data: ${data}`)
  // console.log(status)
  // console.log(data)
  return JSON.stringify(data)
}

/**
 * Create a new user with a name 
 * @author Thai Hoang Tam
 * @param id
 * @param name
 * @returns
 */
async function createUser(id: string, name:string): Promise<string> {
  const body = {
    id: id,
    name: name
  }
  const createUserResponse = await axios.post(`${userPath}/create`, body)
  const data = createUserResponse.data
  const status = createUserResponse.status
  debug(GREEN,`createUser:\n\t- Status: ${status}\n\t- Data: ${data}`)
  
  return JSON.stringify(data)
}

/**
 * Submit transaction asynchronously, allowing the application to process the smart contract response (e.g. update a UI)
 * while waiting for the commit notification.
 * @author: Nguyen Khoa
 * @param id
 * @param sellerID
 * @param buyerID
 * @param buyPercentage
 */
async function transferRealEstate(
  id: string,
  sellerID: string,
  buyerID: string,
  buyPercentage: string
):Promise<string>{
  const body = {
    id: id,
    sellerID: sellerID,
    buyerID: buyerID,
    buyPercentage: buyPercentage
  }
  const transferRealEstateResponse = await axios.post(`${realEstatePath}/transfer`, body)
  const data = transferRealEstateResponse.data
  const status = transferRealEstateResponse.status
  debug(MAGENTA, `transferRealEstate:\n\t- Status: ${status}\n\t- Data: ${data}`)
  return JSON.stringify(data)
}

/**
 * Return an asset read from world state
 * @author Thai Hoang Tam, Nguyen Khoa
 * @param id
 * @returns asset as json object
 */
async function readAsset(id: string): Promise<string> {
  const query = `?id=${id}`
  const readAssetResponse = await axios.get(`${assetPath}/read${query}`)
  const data:string = readAssetResponse.data
  const status:number = readAssetResponse.status
  debug(CYAN, `readAsset:\n\t- Status: ${status}\n\t- Data: ${data}`)
  // console.log(data)
  return JSON.stringify(data)
}

/**
 * Delete an asset from the world state
 * @author Thai Hoang Tam, Nguyen Khoa
 * @param id
 * @returns
 */
async function deleteAsset(id: string): Promise<string> {
  const query = `?id=${id}`
  const deleteAssetsResponse = await axios.delete(`${assetPath}/delete${query}`)
  const data:string = deleteAssetsResponse.data
  const status:number = deleteAssetsResponse.status
  debug(BLUE, `deleteAsset:\n\t- Status: ${status}\n\t- Data: ${data}`)
  return JSON.stringify(data)
}

/**
 * Check if asset exists
 * @author Thai Hoang Tam, Nguyen Khoa
 * @param id
 * @returns
 */
async function assetExists(id:string): Promise<string>{
  const query = `?id=${id}`
  const isAssetsResponse = await axios.get(`${assetPath}/exists${query}`)
  const data:string = isAssetsResponse.data
  const status:number = isAssetsResponse.status
  debug(CYAN, `assetExists:\n\t- Status: ${status}\n\t- Data: ${data}`)
  return JSON.stringify(data)
}

/**
 * Update an real estate
 * @author Thai Hoang Tam, NGuyen Khoa
 * @param id
 * @param roomList
 * @param area
 * @param location
 * @param owners
 * @param membershipThreshold
 * @returns
 */
async function updateRealEstate(
  id: string,
  roomList: string,
  area: string,
  location: string,
  owners: string,
  membershipThreshold: string
): Promise<string> {
  const realEstateData = {
    id: id,
    roomList: roomList,
    area: area,
    location: location,
    owners: owners,
    membershipThreshold: membershipThreshold
  }
  const updateRealEstateResponse = await axios.put(`${realEstatePath}/update`, realEstateData)
  const data = updateRealEstateResponse.data
  const status = updateRealEstateResponse.status
  // console.log(status)
  debug(YELLOW, `updateRealEstate:\n\t- Status: ${status}\n\t- Data: ${data}`)

  return JSON.stringify(data)
}

/**
 * Update a user information
 * @author Thai Hoang Tam
 * @param id
 * @param name
 * @param membershipThreshold
 * @returns
 */
async function updateUser(
  id: string, 
  name: string,
  membershipThreshold:string): Promise<string> {
  const body = {
    id: id,
    name: name,
    membershipThreshold: membershipThreshold
  }
  const updateUserResponse = await axios.put(`${userPath}/update`, body)
  const data = updateUserResponse.data
  const status = updateUserResponse.status
  // console.log(data)
  debug(YELLOW, `updateUser:\n\t- Status: ${status}\n\t- Data: ${data}`)
  return JSON.stringify(data)
}

export {
  getAllAssets,
  createRealEstate,
  updateRealEstate,
  readAsset,
  deleteAsset,
  createUser,
  updateUser,
  assetExists,
  transferRealEstate
}
