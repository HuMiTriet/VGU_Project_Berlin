import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import passport from 'passport'
import { authenticateApiKey, fabricAPIKeyStrategy } from './auth'
import { assetsRouter } from './router/assets'
import { usersRouter } from './router/users'
const { NOT_FOUND } = StatusCodes
dotenv.config()

/**
 * API server using Express.js to get request from React front-end and return
 * response from chaincode
 * @author Thai Hoang Tam
 */
export const server = async (): Promise<Express> => {
  const app: Express = express()
  // to get req.body as a JSON object
  app.use(bodyParser.json())
  app.use(function (req: Request, res: Response, next) {
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

  //define passport startegy
  passport.use(fabricAPIKeyStrategy)

  //initialize passport js
  app.use(passport.initialize())
  app.use('/api/assets', authenticateApiKey, assetsRouter)
  app.use('/api/users', authenticateApiKey, usersRouter)
  // For everything else
  app.use((_req, res) =>
    res.status(NOT_FOUND).json({
      status: NOT_FOUND,
      timestamp: new Date().toISOString()
    })
  )

  return app
}
