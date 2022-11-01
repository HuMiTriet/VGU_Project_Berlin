import express, { Request, Response, Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as token from '../tokenFunctions'
const { ACCEPTED, BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes

export const tokenRouter: Router = express.Router()

/**
 * Get account balance
 * @author Thai Hoang Tam
 */
tokenRouter.get('/:channel/getBalance', async (req: Request, res: Response) => {
  try {
    const msp = <string>req.user
    const channel = req.params.channel
    const contract = req.app.locals[msp + channel + 'token']
    const result = await token.clientAccountBalance(contract)
    console.log('>>> Result', result)
    return res.status(ACCEPTED).send(result)
  } catch (error) {
    console.log(error)
    return res.status(INTERNAL_SERVER_ERROR).send(error)
  }
})

/**
 * Mint token
 * @author Thai Hoang Tam
 */
tokenRouter.post('/:channel/mint', async (req: Request, res: Response) => {
  try {
    const msp = <string>req.user
    const channel = req.params.channel
    const contract = req.app.locals[msp + channel + 'token']
    const body = req.body
    const amount = body.amount
    if (!amount) {
      return res.status(BAD_REQUEST).send('Invalid body to mint token')
    }
    const result = await token.Mint(contract, amount)
    return res.status(ACCEPTED).send(result)
  } catch (error) {
    console.log(error)
    return res.status(INTERNAL_SERVER_ERROR).send(error)
  }
})
