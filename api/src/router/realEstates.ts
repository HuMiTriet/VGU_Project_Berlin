import express, { Request, Response, Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as fabric from '../fabricFunctions'
const { ACCEPTED, BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes

export const realEstatesRouter: Router = express.Router()

/**
 * Get all real estates
 * @author Thai Hoang Tam
 */
realEstatesRouter.get('/getAll', async (req: Request, res: Response) => {
  try {
    const msp = <string>req.user
    const contract = req.app.locals[msp]
    const realEstate = await fabric.getAllRealEstate(contract)
    return res.status(ACCEPTED).send(realEstate)
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
    const name = bodyJson.name
    const area = bodyJson.area
    const location = bodyJson.location
    const roomList = JSON.stringify(bodyJson.roomList)
    const owners = JSON.stringify(bodyJson.owners)
    const membershipThreshold = bodyJson.membershipThreshold
    if (
      !(
        id &&
        name &&
        area &&
        location &&
        roomList &&
        owners &&
        membershipThreshold
      )
    ) {
      return res.status(BAD_REQUEST).send('Invalid data to create real estate')
    }
    const result = await fabric.createRealEstate(
      id,
      name,
      roomList,
      area,
      location,
      owners,
      membershipThreshold
    )
    console.log(result)
    return res.status(ACCEPTED).send(result)
  } catch (error) {
    console.log(error)
    return res.status(INTERNAL_SERVER_ERROR).send(error)
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
    const name = bodyJson.name
    const area = bodyJson.area
    const location = bodyJson.location
    const roomList = JSON.stringify(bodyJson.roomList)
    const owners = JSON.stringify(bodyJson.owners)
    const membershipThreshold = bodyJson.membershipThreshold
    if (
      !(
        id &&
        name &&
        area &&
        location &&
        roomList &&
        owners &&
        membershipThreshold
      )
    ) {
      return res.status(BAD_REQUEST).send('Invalid data to create real estate')
    }
    const result = await fabric.updateRealEstate(
      id,
      name,
      roomList,
      area,
      location,
      owners,
      membershipThreshold
    )
    console.log('> API Result ', result)
    res.status(ACCEPTED).send(result)
  } catch (error) {
    console.log(error)
    res.status(INTERNAL_SERVER_ERROR).send(error)
  }
})

/**
 * Transfer real estate
 * @author Thai Hoang Tam
 */
realEstatesRouter.put('/transfer', async (req: Request, res: Response) => {
  try {
    const body = req.body
    const id = body.id
    const sellerID = body.sellerID
    const buyerID = body.buyerID
    const buyPercentage = body.buyPercentage
    if (!(id && sellerID && buyerID && buyPercentage)) {
      return res
        .status(BAD_REQUEST)
        .send('Invalid data to transfer real estate')
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
