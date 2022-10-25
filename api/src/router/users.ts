import express, { Request, Response, Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as fabric from '../fabric'
const { ACCEPTED, BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes

export const usersRouter: Router = express.Router()

/**
 * Create user
 * @author Thai Hoang Tam
 */
usersRouter.post('/create', async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const body = req.body
    const userID: string = body.userID
    const balance: string = body.balance
    if (userID != undefined && balance != undefined) {
      const user = await fabric.createUser(userID, balance)
      return res.status(ACCEPTED).send(user)
    } else {
      return res.status(BAD_REQUEST).send('Invalid data format to create user')
    }
  } catch (error) {
    console.log(error)
    res.status(INTERNAL_SERVER_ERROR).send(error)
  }
})

/**
 * Update user
 * @author Thai Hoang Tam
 */
usersRouter.post('/update', async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const body = req.body
    const userID: string = body.userID
    const balance: string = body.balance
    const membershipScore: string = body.membershipScore
    if (!(userID && balance && membershipScore)) {
      const user = await fabric.updateUser(userID, balance, membershipScore)
      return res.status(ACCEPTED).send(user)
    }
    return res.status(BAD_REQUEST).send('Invalid data format to create user')
  } catch (error) {
    console.log(error)
    res.status(INTERNAL_SERVER_ERROR).send(error)
  }
})
