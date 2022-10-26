import express, { Request, Response, Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as fabric from '../fabric'
const { ACCEPTED, BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes

export const realEstatesRouter: Router = express.Router()

realEstatesRouter.use(function (req: Request, res: Response, next) {
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

/**
 * Get all real estates
 * @author Thai Hoang Tam
 */
realEstatesRouter.get('/getAll', async (req: Request, res: Response) => {
  try {
    console.log('Get all real estate')
    const assets = await fabric.getAllRealEstate()
    return res.status(ACCEPTED).send(assets)
  } catch (error) {
    console.log(error)
    return res.status(INTERNAL_SERVER_ERROR).send(error)
  }
})

/**
 * Create new real estate
 * @author Thai Hoang Tam
 */
realEstatesRouter.post('/create', async (req: Request, res: Response) => {
  try {
    const bodyJson = req.body
    console.log(bodyJson)
    const id = bodyJson.id
    const area = bodyJson.area
    const location = bodyJson.location
    const roomList = JSON.stringify(bodyJson.roomList)
    const owners = JSON.stringify(bodyJson.owners)
    const membershipThreshold = bodyJson.membershipThreshold
    if (
      !(id && area && location && roomList && owners && membershipThreshold)
    ) {
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
realEstatesRouter.put('/update', async (req: Request, res: Response) => {
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
realEstatesRouter.put('/transfer', async (req: Request, res: Response) => {
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
