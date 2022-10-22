import axios from 'axios'
const port = '3001'
const host = `localhost:${port}`
async function getAssets(): Promise<string> {
  const assetsResponse = await axios.get(`http://${host}/api/assets/getAll`)
  const data = assetsResponse.data
  console.log(JSON.parse(JSON.stringify(data)))
  return JSON.stringify(data)
}

// not work
async function createAsset(
  assetID: string,
  roomList: string,
  area: string,
  location: string,
  ownership: string
): Promise<string> {
  const assetData = {
    assetID: assetID,
    roomList: roomList,
    area: area,
    location: location,
    ownership: ownership
  }
  const testData = {
    area: '200',
    assetID: 'asset123',
    docType: 'asset',
    location: 'Ho Chi Minh',
    owners: [
      {
        isSeller: 'true',
        ownerID: 'user1',
        ownershipPercentage: '100',
        sellPercentage: '50',
        sellPrice: '1000',
        sellThreshold: '5'
      }
    ],
    roomList: {
      numOfBathroom: '2',
      numOfBedroom: '2',
      numOfDiningroom: '2',
      numOfLivingroom: '1'
    }
  }
  const createAssetsResponse = await axios.post(
    `http://${host}/api/assets/create`,
    testData,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  const data = createAssetsResponse.data
  const status = createAssetsResponse.status
  console.log(status)

  return status.toString()
}

async function deleteAsset(assetID: string): Promise<string> {
  const query = `?assetID=${assetID}`
  const deleteAssetsResponse = await axios.delete(
    `http://${host}/api/assets/delete${query}`
  )
  const data = deleteAssetsResponse.data
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
