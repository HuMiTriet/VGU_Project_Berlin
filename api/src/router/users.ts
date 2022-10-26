import express, { Request, Response, Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as fabric from '../fabricFunctions'
const { ACCEPTED, BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes

export const usersRouter: Router = express.Router()

/**
 * Create user
 * @author Thai Hoang Tam, Nguyen Khoa
 */
usersRouter.post('/create', async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const body = req.body
    const id: string = body.id
    const name: string = body.name
    const msp = <string>req.user
    const contract = req.app.locals[msp]
    if (!(id && name)) {
      return res.status(BAD_REQUEST).send('Invalid data format to create user')
    }
    const user = await fabric.createUser(contract, id, name)
    return res.status(ACCEPTED).send(user)
  } catch (error) {
    console.log(error)
    res.status(INTERNAL_SERVER_ERROR).send(error)
  }
})

/**
 * Update user
 * @author Thai Hoang Tam
 */
usersRouter.put('/update', async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const body = req.body
    const id: string = body.id
    const name: string = body.name
    const membershipScore: string = body.membershipScore
    const msp = <string>req.user
    const contract = req.app.locals[msp]
    if (!(id && name && membershipScore)) {
      return res.status(BAD_REQUEST).send('Invalid data format to create user')
    }
    const user = await fabric.updateUser(contract, id, name, membershipScore)
    return res.status(ACCEPTED).send(user)
  } catch (error) {
    console.log(error)
    res.status(INTERNAL_SERVER_ERROR).send(error)
  }
})
