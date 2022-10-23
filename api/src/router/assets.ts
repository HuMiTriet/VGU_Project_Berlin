import express, { Request, Response, Router } from 'express'
import * as fabric from '../app'
import { StatusCodes } from 'http-status-codes'
const { ACCEPTED, BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes

export const assetsRouter: Router = express.Router()

/**
 * Get all assets
 * @author Thai Hoang Tam
 */
assetsRouter.get('/getAll', async (req: Request, res: Response) => {
  console.log('Get all assets')
  try {
    const assets = await fabric.getAllAssets()
    return res.status(ACCEPTED).send(assets)
  } catch (error) {
    console.log(error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send('Fail to get all assets')
  }
})
/**
 * Read assets
 * @author Thai Hoang Tam
 */
assetsRouter.get('/read', async (req, res) => {
  try {
    const query = req.query
    const assetID = <string>query['assetID']
    if (assetID != undefined) {
      console.log(assetID)
      const asset = await fabric.readAsset(assetID)
      res.status(ACCEPTED).send(asset)
    } else {
      res.status(BAD_REQUEST).send('Invalid query to read asset')
    }
  } catch (error) {
    console.log(error)
    res.status(INTERNAL_SERVER_ERROR).send('Fail to read asset')
  }
})

/**
 * Check if asset exists
 * @author Thai Hoang Tam
 */
assetsRouter.get('/exists', async (req, res) => {
  try {
    const query = req.query
    const assetID = <string>query['assetID']
    if (assetID != undefined) {
      console.log(assetID)
      const asset = await fabric.assetExists(assetID)
      res.status(ACCEPTED).send(asset)
    } else {
      res.status(BAD_REQUEST).send('Invalid query to check asset exists')
    }
  } catch (error) {
    console.log(error)
    res.status(INTERNAL_SERVER_ERROR).send('Fail to check asset exists')
  }
})
/**
 * Create new asset
 * @author Thai Hoang Tam
 */
assetsRouter.post('/create', async (req: Request, res: Response) => {
  try {
    const bodyJson = req.body
    console.log(bodyJson)
    const assetID = bodyJson.assetID
    const area = bodyJson.area
    const location = bodyJson.location
    const roomList = JSON.stringify(bodyJson.roomList)
    const owners = JSON.stringify(bodyJson.owners)
    const result = await fabric.createAsset(
      assetID,
      roomList,
      area,
      location,
      owners
    )
    console.log(result)

    result != undefined
      ? res.status(ACCEPTED).send('Create asset successfully')
      : res.status(BAD_REQUEST).send('Invalid data to create asset')
  } catch (error) {
    console.log(error)
    res.status(INTERNAL_SERVER_ERROR).send('Server fail to create asset')
  }
})

/**
 * Delete asset
 * @author Thai Hoang Tam
 */
assetsRouter.delete('/delete', async (req, res) => {
  try {
    console.log('Delete Asset')
    const query = req.query
    const assetID: string = <string>query['assetID']
    if (assetID != undefined) {
      const result = await fabric.deleteAsset(assetID)
      console.log(result)
      res.status(ACCEPTED).send('Delete asset successfully')
    } else {
      res.status(BAD_REQUEST).send('Invalid query format')
    }
  } catch (error) {
    console.log(error)
    res.status(INTERNAL_SERVER_ERROR).send('Server fail to delete asset')
  }
})

/**
 * Update asset
 * @author Thai Hoang Tam
 */
assetsRouter.put('/update', async (req, res) => {
  try {
    const bodyJson = req.body
    console.log(bodyJson)
    const assetID = bodyJson.assetID
    const area = bodyJson.area
    const location = bodyJson.location
    const roomList = JSON.stringify(bodyJson.roomList)
    const owners = JSON.stringify(bodyJson.owners)
    const result = await fabric.updateAsset(
      assetID,
      roomList,
      area,
      location,
      owners
    )
    console.log(result)

    result != undefined
      ? res.status(ACCEPTED).send('Create asset successfully')
      : res.status(BAD_REQUEST).send('Invalid data to create asset')
  } catch (error) {
    console.log(error)
    res.status(INTERNAL_SERVER_ERROR).send('Fail to update asset')
  }
})
