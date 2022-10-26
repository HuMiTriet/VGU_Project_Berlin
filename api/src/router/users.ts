import express, { Request, Response, Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as fabric from '../fabric'
const { ACCEPTED, BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes

export const usersRouter: Router = express.Router()

usersRouter.use(function (req: Request, res: Response, next) {
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
 * Create user
 * @author Thai Hoang Tam
 */
usersRouter.post('/create', async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const body = req.body
    const id: string = body.id
    const name: string = body.name
    if (!(id && name)) {
      return res.status(BAD_REQUEST).send('Invalid data format to create user')
    }
    const user = await fabric.createUser(id, name)
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
usersRouter.post('/update', async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const body = req.body
    const id: string = body.id
    const name: string = body.name
    const membershipScore: string = body.membershipScore
    if (!(id && name && membershipScore)) {
      return res.status(BAD_REQUEST).send('Invalid data format to create user')
    }
    const user = await fabric.updateUser(id, name, membershipScore)
    return res.status(ACCEPTED).send(user)
  } catch (error) {
    console.log(error)
    res.status(INTERNAL_SERVER_ERROR).send(error)
  }
})
