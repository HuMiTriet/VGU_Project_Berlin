import express, { Request, Response, Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as fabric from '../fabricFunctions'
import * as token from '../tokenFunctions'
const { ACCEPTED, BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes

export const realEstatesRouter: Router = express.Router()

/**
 * Get all real estates
 * @author Thai Hoang Tam
 */
realEstatesRouter.get(
  '/:channel/getAll',
  async (req: Request, res: Response) => {
    try {
      const msp = <string>req.user
      const channel = req.params.channel
      const contract = req.app.locals[msp + channel + 'basic']
      const realEstate = await fabric.getAllRealEstate(contract)
      return res.status(ACCEPTED).send(realEstate)
    } catch (error) {
      console.log(error)
      return res.status(INTERNAL_SERVER_ERROR).send(error)
    }
  }
)

/**
 * Get all real estates
 * @author Thai Hoang Tam
 */
realEstatesRouter.get(
  '/:channel/getUserRealEstate',
  async (req: Request, res: Response) => {
    try {
      const msp = <string>req.user
      const channel = req.params.channel
      const contract = req.app.locals[msp + channel + 'basic']
      const userID = <string>req.query.userID
      if (!userID) {
        res.status(BAD_REQUEST).send('Invalid data to get all user real estate')
      }
      const realEstate = await fabric.getUserRealEstate(contract, userID)
      return res.status(ACCEPTED).send(realEstate)
    } catch (error) {
      console.log(error)
      return res.status(INTERNAL_SERVER_ERROR).send(error)
    }
  }
)

/**
 * Create new real estate
 * @author Thai Hoang Tam, Nguyen Khoa
 */
realEstatesRouter.post(
  '/:channel/create',
  async (req: Request, res: Response) => {
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
      const msp = <string>req.user
      const channel = req.params.channel
      const contract = req.app.locals[msp + channel + 'basic']
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
        return res
          .status(BAD_REQUEST)
          .send('Invalid data to create real estate')
      }
      const result = await fabric.createRealEstate(
        contract,
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
  }
)

/**
 * Update real estate
 * @author Thai Hoang Tam, Nguyen Khoa
 */
realEstatesRouter.put(
  '/:channel/update',
  async (req: Request, res: Response) => {
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
      const msp = <string>req.user
      const channel = req.params
      const contract = req.app.locals[msp + channel + 'basic']
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
        return res
          .status(BAD_REQUEST)
          .send('Invalid data to create real estate')
      }
      const result = await fabric.updateRealEstate(
        contract,
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
  }
)

/**
 * Transfer real estate
 * @author Thai Hoang Tam, Nguyen Khoa
 */
realEstatesRouter.put(
  '/:channel/transfer',
  async (req: Request, res: Response) => {
    try {
      const body = req.body
      const id = body.id
      const sellerID = body.sellerID
      const buyerID = body.buyerID
      const buyPercentage = body.buyPercentage
      const value = body.value
      const msp = <string>req.user
      const channel = req.params.channel
      const contractBasic = req.app.locals[msp + channel + 'basic']
      const contractToken = req.app.locals[msp + channel + 'token']
      if (!(id && sellerID && buyerID && buyPercentage)) {
        return res
          .status(BAD_REQUEST)
          .send('Invalid data to transfer real estate')
      }
      try {
        await fabric.canTransferRealEstate(
          contractBasic,
          id,
          sellerID,
          buyerID,
          buyPercentage
        )
        await token.canTransferToken(contractToken, sellerID, value)
      } catch (error: any) {
        console.log('>>> Error', error)
        return res.status(BAD_REQUEST).send(error.details[0].message)
      }
      const result = await fabric.transferRealEstate(
        contractBasic,
        id,
        sellerID,
        buyerID,
        buyPercentage
      )
      const tokenResult = await token.transferToken(
        contractToken,
        sellerID,
        value
      )
      return res
        .status(ACCEPTED)
        .json({ realEstateResult: result, tokenResult: tokenResult })
    } catch (error: any) {
      console.log(error)
      res.status(INTERNAL_SERVER_ERROR).send(error.details[0].message)
    }
  }
)
