import express, { Request, Response, Router } from 'express'
import * as fabric from '../app'
import { StatusCodes } from 'http-status-codes'
const { ACCEPTED, BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes

export const usersRouter: Router = express.Router()

/**
 * Create user
 * @author Thai Hoang Tam
 */
usersRouter.post('/create', async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const query = req.query
    const userID: string = <string>query['userID']
    const balance: string = <string>query['balance']
    if (userID != undefined && balance != undefined) {
      const user = await fabric.createUser(userID, balance)
      return res.status(ACCEPTED).send(user)
    } else {
      return res.status(BAD_REQUEST).send('Invalid query format to create user')
    }
  } catch (error) {
    console.log(error)
    res.status(INTERNAL_SERVER_ERROR).send('Server fail to create user')
  }
})
