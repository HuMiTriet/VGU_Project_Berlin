import axios from 'axios'
const httpPort = '3001'
const httpHost = `localhost:${httpPort}`
const channelName = localStorage['channel'] || 'mychannel'
const assetPath = `http://${httpHost}/api/assets/${channelName}`
const userPath = `http://${httpHost}/api/users/${channelName}`
const realEstatePath = `http://${httpHost}/api/realestates/${channelName}`
const tokenPath = `http://${httpHost}/api/token/${channelName}`
const apiKey = localStorage['apiKey'] || 'c8caa01f-df2d-4be7-99d4-9e8ab0f370e0'
// const httpsPort = '3002'
// const httpsHost = `localhost:${httpsPort}`

axios.defaults.headers.common = {
  'x-api-key': apiKey,
  'Content-Type': 'application/json',
  Accept: '*/*'
}

const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const BLUE = '\x1b[34m'
const MAGENTA = '\x1b[35m'
const CYAN = '\x1b[36m'
const RESET = '\x1b[0m'
/**
 * @author Nguyen Khoa
 */
function debug(color: string, msgString: string) {
  console.log(`${color}\n\t${msgString}${RESET}\n`)
}

/**
 * Get all assets (Real estates and users)
 * @author Thai Hoang Tam, Nguyen Khoa
 */
async function getAllAssets(): Promise<string> {
  console.log('Get all assets')
  const assetsResponse = await axios.get(`${assetPath}/getAll`)
  const data = assetsResponse.data
  const status = assetsResponse.status
  // console.log(JSON.parse(JSON.stringify(data)))
  debug(
    CYAN,
    `getAllAssets:\n\t- Status: ${status}\n\t- Data: ${JSON.stringify(data)}`
  )
  return JSON.stringify(data)
}

/**
 * Get all user real estate
 * @author Thai Hoang Tam, Nguyen Khoa
 */
async function getUserRealEstate(userID: string): Promise<string> {
  console.log('Get user real estate')
  const query = `?userID=${userID}`
  const assetsResponse = await axios.get(
    `${realEstatePath}/getUserRealEstate${query}`
  )
  const data = assetsResponse.data
  const status = assetsResponse.status
  debug(
    CYAN,
    `getUserRealEstate:\n\t- Status: ${status}\n\t- Data: ${JSON.stringify(
      data
    )}`
  )
  return JSON.stringify(data)
}

/**
 * Get all Real Estates
 * @author Nguyen Khoa
 */
async function getAllRealEstate(): Promise<string> {
  const realEstateResponse = await axios.get(`${realEstatePath}/getAll`)
  const data = realEstateResponse.data
  const status = realEstateResponse.status
  // console.log(JSON.parse(JSON.stringify(data)))
  debug(
    CYAN,
    `getAllRealEstate:\n\t- Status: ${status}\n\t- Data: ${JSON.stringify(
      data
    )}`
  )
  return JSON.stringify(data)
}

/**
 * Create new Real Estate
 * @author Thai Hoang Tam, Nguyen Khoa
 * @param id
 * @param name
 * @param roomList
 * @param area
 * @param location
 * @param owners
 * @param membershipThreshold
 */
async function createRealEstate(
  id: string,
  name: string,
  roomList: string,
  area: string,
  location: string,
  owners: string,
  membershipThreshold: string
): Promise<string> {
  const realEstateData = {
    id: id,
    name: name,
    roomList: JSON.parse(roomList),
    area: area,
    location: location,
    owners: JSON.parse(owners),
    membershipThreshold: membershipThreshold
  }
  let createRealEstateResponse
  try {
    createRealEstateResponse = await axios.post(
      `${realEstatePath}/create`,
      realEstateData
    )
  } catch (error) {
    console.log(error)
    throw error
  }
  const data = createRealEstateResponse.data
  const status = createRealEstateResponse.status
  debug(
    GREEN,
    `createRealEstate:\n\t- Status: ${status}\n\t- Data: ${JSON.stringify(
      data
    )}`
  )
  return JSON.stringify(data)
}

/**
 * Create a new user with a name
 * @author Thai Hoang Tam, Nguyen Khoa
 * @param id
 * @param name
 * @returns
 */
async function createUser(id: string, name: string): Promise<string> {
  const body = {
    id: id,
    name: name
  }
  const createUserResponse = await axios.post(`${userPath}/create`, body)
  const data = createUserResponse.data
  const status = createUserResponse.status
  debug(
    GREEN,
    `createUser:\n\t- Status: ${status}\n\t- Data: ${JSON.stringify(data)}`
  )
  return JSON.stringify(data)
}

/**
 * Submit transaction asynchronously, allowing the application to process the smart contract response (e.g. update a UI)
 * while waiting for the commit notification.
 * @author Nguyen Khoa
 * @param id
 * @param sellerID
 * @param buyerID
 * @param buyPercentage
 */
async function transferRealEstate(
  id: string,
  sellerID: string,
  buyerID: string,
  buyPercentage: string,
  value: string
): Promise<string> {
  const body = {
    id: id,
    sellerID: sellerID,
    buyerID: buyerID,
    buyPercentage: buyPercentage,
    value: value
  }
  const transferRealEstateResponse = await axios.put(
    `${realEstatePath}/transfer`,
    body
  )
  const data = transferRealEstateResponse.data
  const status = transferRealEstateResponse.status
  debug(
    MAGENTA,
    `transferRealEstate:\n\t- Status: ${status}\n\t- Data: ${JSON.stringify(
      data
    )}`
  )
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
  const data: string = readAssetResponse.data
  const status: number = readAssetResponse.status
  debug(
    CYAN,
    `readAsset:\n\t- Status: ${status}\n\t- Data: ${JSON.stringify(
      JSON.stringify(data)
    )}`
  )
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
  const data: string = deleteAssetsResponse.data
  const status: number = deleteAssetsResponse.status
  debug(
    BLUE,
    `deleteAsset:\n\t- Status: ${status}\n\t- Data: ${JSON.stringify(data)}`
  )
  return JSON.stringify(data)
}

/**
 * Check if asset exists
 * @author Thai Hoang Tam, Nguyen Khoa
 * @param id
 * @returns
 */
async function assetExists(id: string): Promise<string> {
  const query = `?id=${id}`
  const isAssetsResponse = await axios.get(`${assetPath}/exists${query}`)
  const data: string = isAssetsResponse.data
  const status: number = isAssetsResponse.status
  debug(
    CYAN,
    `assetExists:\n\t- Status: ${status}\n\t- Data: ${JSON.stringify(data)}`
  )
  return JSON.stringify(data)
}

/**
 * Update an real estate
 * @author Thai Hoang Tam, Nguyen Khoa
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
  name: string,
  roomList: string,
  area: string,
  location: string,
  owners: string,
  membershipThreshold: string
): Promise<string> {
  const realEstateData = {
    id: id,
    name: name,
    roomList: roomList,
    area: area,
    location: location,
    owners: owners,
    membershipThreshold: membershipThreshold
  }
  const updateRealEstateResponse = await axios.put(
    `${realEstatePath}/update`,
    realEstateData
  )
  const data = updateRealEstateResponse.data
  const status = updateRealEstateResponse.status
  debug(
    YELLOW,
    `updateRealEstate:\n\t- Status: ${status}\n\t- Data: ${JSON.stringify(
      data
    )}`
  )
  return JSON.stringify(data)
}

/**
 * Update a user information
 * @author Thai Hoang Tam, Nguyen Khoa
 * @param id
 * @param name
 * @param membershipScore
 * @returns
 */
async function updateUser(
  id: string,
  name: string,
  membershipScore: string
): Promise<string> {
  const body = {
    id: id,
    name: name,
    membershipScore: membershipScore
  }
  const updateUserResponse = await axios.put(`${userPath}/update`, body)
  const data = updateUserResponse.data
  const status = updateUserResponse.status
  debug(
    YELLOW,
    `updateUser:\n\t- Status: ${status}\n\t- Data: ${JSON.stringify(data)}`
  )
  return JSON.stringify(data)
}

/**
 * Mint token
 * @author Thai Hoang Tam
 */
async function mint(amount: string): Promise<string> {
  const tokenResponse = await axios.post(`${tokenPath}/mint`, {
    amount: amount
  })
  const data = tokenResponse.data
  const status = tokenResponse.status
  debug(CYAN, `mint:\n\t- Status: ${status}\n\t- Data: ${JSON.stringify(data)}`)
  return JSON.stringify(data)
}

/**
 * Get account balance
 * @author Thai Hoang Tam
 */
async function getAccountBalance(): Promise<string> {
  const tokenResponse = await axios.get(`${tokenPath}/getBalance`)
  const data = tokenResponse.data
  const status = tokenResponse.status
  debug(
    CYAN,
    `getAccountBalance:\n\t- Status: ${status}\n\t- Data: ${JSON.stringify(
      data
    )}`
  )
  return JSON.stringify(data)
}

export {
  getAllAssets,
  getUserRealEstate,
  getAllRealEstate,
  createRealEstate,
  updateRealEstate,
  readAsset,
  deleteAsset,
  createUser,
  updateUser,
  assetExists,
  transferRealEstate,
  mint,
  getAccountBalance
}
