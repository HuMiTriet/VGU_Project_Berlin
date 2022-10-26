import express, { Request, Response, Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as fabric from '../fabric'
const { ACCEPTED, BAD_REQUEST, INTERNAL_SERVER_ERROR, OK } = StatusCodes

export const assetsRouter: Router = express.Router()
assetsRouter.use(function (req: Request, res: Response, next) {
  res.header('Access-Control-Allow-Origin', '*') // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, X-API-KEY, Accept-Encoding, x-api-key'
  )
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, DELETE, PATCH, HEAD'
  )
  next()
})

assetsRouter.options('/getAll', (req, res) => {
  res.status(200).send('OK')
})

/**
 * Get all assets
 * @author Thai Hoang Tam
 */
assetsRouter.get('/getAll', async (req: Request, res: Response) => {
  try {
    console.log('Get all assets')
    const assets = await fabric.getAllAssets()
    return res.status(ACCEPTED).send(assets)
  } catch (error) {
    console.log(error)
    return res.status(INTERNAL_SERVER_ERROR).send(error)
  }
})

/**
 * Read assets
 * @author Thai Hoang Tam
 */
assetsRouter.get('/read', async (req, res) => {
  try {
    const query = req.query
    const id = <string>query['id']
    if (!id) {
      return res.status(BAD_REQUEST).send('Invalid query to read asset')
    }
    console.log(id)
    const asset = await fabric.readAsset(id)
    return res.status(ACCEPTED).send(asset)
  } catch (error) {
    console.log(error)
    return res.status(INTERNAL_SERVER_ERROR).send('Fail to read asset')
  }
})

/**
 * Check if asset exists
 * @author Thai Hoang Tam
 */
assetsRouter.get('/exists', async (req, res) => {
  try {
    const query = req.query
    const id = <string>query['id']
    if (!id) {
      res.status(BAD_REQUEST).send('Invalid query to check asset exists')
    }
    console.log(id)
    const asset = await fabric.assetExists(id)
    res.status(ACCEPTED).send(asset)
  } catch (error) {
    console.log(error)
    res.status(INTERNAL_SERVER_ERROR).send(error)
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
    const id = bodyJson.id
    const area = bodyJson.area
    const location = bodyJson.location
    const roomList = JSON.stringify(bodyJson.roomList)
    const owners = JSON.stringify(bodyJson.owners)
    const membershipThreshold = bodyJson.membershipThreshold
    if (!(id && area && location && roomList && owners)) {
      return res.status(BAD_REQUEST).send('Invalid data to create asset')
    }
    const result = await fabric.createRealEstate(
      id,
      roomList,
      area,
      location,
      owners,
      membershipThreshold
    )
    console.log(result)
    return res.status(ACCEPTED).send('Create asset successfully')
  } catch (error) {
    console.log(error)
    return res.status(INTERNAL_SERVER_ERROR).send('Server fail to create asset')
  }
})

/**
 * Update real estate
 * @author Thai Hoang Tam
 */
assetsRouter.put('/update', async (req, res) => {
  try {
    const bodyJson = req.body
    console.log(bodyJson)
    const id = bodyJson.id
    const area = bodyJson.area
    const location = bodyJson.location
    const roomList = JSON.stringify(bodyJson.roomList)
    const owners = JSON.stringify(bodyJson.owners)
    const membershipThreshold = bodyJson.membershipThreshold
    if (!(id && area && location && roomList && owners)) {
      return res.status(BAD_REQUEST).send('Invalid data to create asset')
    }
    const result = await fabric.updateRealEstate(
      id,
      roomList,
      area,
      location,
      owners,
      membershipThreshold
    )
    console.log(result)
    return res.status(ACCEPTED).send('Create asset successfully')
  } catch (error) {
    console.log(error)
    res.status(INTERNAL_SERVER_ERROR).send('Fail to update asset')
  }
})

/**
 * Transfer real estate
 * @author Thai Hoang Tam
 */
assetsRouter.put('/transfer', async (req: Request, res: Response) => {
  try {
    console.log('Transfer asset')
    const body = req.body
    const id = body.id
    const sellerID = body.sellerID
    const buyerID = body.buyerID
    const buyPercentage = body.buyPercentage
    if (!(id && sellerID && buyerID && buyPercentage)) {
      return res.status(BAD_REQUEST).send('Invalid data to transfer asset')
    }
    const result = await fabric.transferRealEstate(
      id,
      sellerID,
      buyerID,
      buyPercentage
    )
    return res.status(ACCEPTED).send(result)
  } catch (error) {
    console.log(error)
    return res.status(INTERNAL_SERVER_ERROR).send(error)
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
    const id: string = <string>query['id']
    if (!id) {
      return res.status(BAD_REQUEST).send('Invalid query format')
    }
    const result = await fabric.deleteAsset(id)
    console.log(result)
    return res.status(ACCEPTED).send(result)
  } catch (error) {
    console.log(error)
    return res.status(INTERNAL_SERVER_ERROR).send(error)
  }
})
