import { Contract } from '@hyperledger/fabric-gateway'
import { TextDecoder } from 'util'
const utf8Decoder = new TextDecoder()

/**
 * Initialize the ledger to get some Real Estate and Users
 */
export async function initLedger(contract: Contract): Promise<void> {
  console.log('*** Init ledger')
  await contract.submitTransaction('InitLedger')
  console.log('*** Init ledger successfully')
}

/**
 * Get all assets (Real estate and user)
 * @author Thai Hoang Tam
 * @param contract
 * @return all assets from ledger
 */
export async function getAllAssets(contract: Contract): Promise<string> {
  try {
    console.log('*** Get all assets')
    const resultBytes = await contract.evaluateTransaction('GetAllAssets')
    const resultJson = utf8Decoder.decode(resultBytes)
    const result = JSON.parse(resultJson)
    console.log('*** Result:', result)
    return result
  } catch (error: unknown) {
    console.log('*** Error:', error)
    return <string>error
  }
}

/**
 * Get all real estate
 * @author Thai Hoang Tam
 * @param contract
 * @return all real estate from ledger
 */
export async function getAllRealEstate(contract: Contract): Promise<string> {
  try {
    console.log('*** Get all real estate')
    const resultBytes = await contract.evaluateTransaction('GetAllRealEstate')
    const resultJson = utf8Decoder.decode(resultBytes)
    const result = JSON.parse(resultJson)
    console.log('*** Result:', result)
    return result
  } catch (error: unknown) {
    console.log('*** Error:', error)
    return <string>error
  }
}

/**
 * Create new Real Estate
 * @author Thai Hoang Tam
 * @param contract
 * @param id
 * @param name
 * @param roomList
 * @param area
 * @param location
 * @param owners
 * @param membershipThreshold
 */
export async function createRealEstate(
  contract: Contract,
  id: string,
  name: string,
  roomList: string,
  area: string,
  location: string,
  owners: string,
  membershipThreshold: string
): Promise<string> {
  try {
    console.log('*** Create Real Estate')
    const resultBytes = await contract.submitTransaction(
      'CreateRealEstate',
      id,
      name,
      roomList,
      area,
      location,
      owners,
      membershipThreshold
    )
    const resultJson = utf8Decoder.decode(resultBytes)
    const result = JSON.parse(resultJson)
    console.log('*** Result:', result)
    console.log('*** Real Estate created')
    return result
  } catch (error: unknown) {
    console.log(error)
    return <string>error
  }
}

/**
 * Create a new user with a starting balance
 * @author Thai Hoang Tam
 * @param contract
 * @param id
 * @param name
 * @returns
 */
export async function createUser(contract: Contract, id: string, name: string) {
  try {
    console.log('*** Create user')
    const resultBytes = await contract.submitTransaction('CreateUser', id, name)
    const resultJson = utf8Decoder.decode(resultBytes)
    const result = JSON.parse(resultJson)
    console.log('*** Result:', result)
    return result
  } catch (error) {
    console.log('*** Error:', error)
    return error
  }
}

/**
 * Transfer real estate
 * @author Thai Hoang Tam
 * @param contract
 * @param id
 * @param sellerID
 * @param buyerID
 * @param buyPercentage
 * @returns
 */
export async function transferRealEstate(
  contract: Contract,
  id: string,
  sellerID: string,
  buyerID: string,
  buyPercentage: string
): Promise<string> {
  let result
  try {
    console.log('*** Transfer Real Estate')
    const commit = await contract.submitAsync('TransferRealEstate', {
      arguments: [id, sellerID, buyerID, buyPercentage]
    })
    result = utf8Decoder.decode(commit.getResult())
    const status = await commit.getStatus()
    if (!status.successful) {
      throw new Error(
        `Transaction ${status.transactionId} failed to commit with status code ${status.code}`
      )
    }
    console.log('*** Result:', result)
    return result
  } catch (error: unknown) {
    console.log('*** Error:', error)
    return <string>error
  }
}

/**
 * Return an asset read from world state
 * @author Thai Hoang Tam
 * @param contract
 * @param id
 * @returns asset as json object
 */
export async function readAsset(
  contract: Contract,
  id: string
): Promise<string> {
  console.log('*** Read Asset')
  let result
  try {
    const resultBytes = await contract.evaluateTransaction('ReadAsset', id)
    const resultJson = utf8Decoder.decode(resultBytes)
    console.log(resultJson)
    result = JSON.parse(resultJson)
    console.log('*** Result:', result)
    return result
  } catch (error: unknown) {
    console.log('*** Error:', error)
    return <string>error
  }
}

/**
 * Delete an asset from the world state
 * @author Thai Hoang Tam
 * @param contract
 * @param id
 * @returns
 */
export async function deleteAsset(
  contract: Contract,
  id: string
): Promise<string> {
  try {
    console.log('*** Delete asset')
    const resultBytes = await contract.submitTransaction('DeleteAsset', id)
    const resultJson = utf8Decoder.decode(resultBytes)
    const result = JSON.parse(resultJson)
    console.log('*** Result:', result)
    return result
  } catch (error: unknown) {
    console.log(error)
    console.log('*** Error:', error)
    return <string>error
  }
}

/**
 * Check if asset exists
 * @author Thai Hoang Tam
 * @param contract
 * @param id
 * @returns
 */
export async function assetExists(
  contract: Contract,
  id: string
): Promise<string> {
  try {
    console.log('*** Asset Exist')
    const resultBytes = await contract.evaluateTransaction('AssetExists', id)
    const resultJson = utf8Decoder.decode(resultBytes)
    const result = JSON.parse(resultJson)
    console.log('*** Result:', result)
    return result
  } catch (error: unknown) {
    console.log('*** Error:', error)
    return <string>error
  }
}

/**
 * Update an real estate
 * @author Thai Hoang Tam
 * @param contract
 * @param id
 * @param name
 * @param roomList
 * @param area
 * @param location
 * @param owners
 * @param membershipThreshold
 * @returns
 */
export async function updateRealEstate(
  contract: Contract,
  id: string,
  name: string,
  roomList: string,
  area: string,
  location: string,
  owners: string,
  membershipThreshold: string
): Promise<string> {
  try {
    console.log('Update Real Estate')
    const resultBytes = await contract.submitTransaction(
      'UpdateRealEstate',
      id,
      name,
      roomList,
      area,
      location,
      owners,
      membershipThreshold
    )
    const resultJson = utf8Decoder.decode(resultBytes)
    const result = JSON.parse(resultJson)
    console.log('*** Result:', result)
    return result
  } catch (error: unknown) {
    console.log('*** Error:', error)
    return <string>error
  }
}

/**
 * Update a user information
 * @author Thai Hoang Tam
 * @param contract
 * @param id
 * @param name
 * @param membershipScore
 * @returns
 */
export async function updateUser(
  contract: Contract,
  id: string,
  name: string,
  membershipScore: string
): Promise<string> {
  try {
    console.log('Update User')
    const resultBytes = await contract.submitTransaction(
      'UpdateUser',
      id,
      name,
      membershipScore
    )
    const resultJson = utf8Decoder.decode(resultBytes)
    const result = JSON.parse(resultJson)
    console.log('*** Result:', result)
    return result
  } catch (error: unknown) {
    console.log('*** Error:', error)
    return <string>error
  }
}
