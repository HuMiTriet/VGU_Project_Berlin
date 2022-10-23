import express, { Express, Request, Response } from 'express'
import * as fabric from './app'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { assetsRouter } from './router/assets'
import { usersRouter } from './router/users'
import { StatusCodes } from 'http-status-codes'
const { NOT_FOUND } = StatusCodes
dotenv.config()

const port = process.env.PORT
const host = `localhost:${port}`
const app: Express = express()

/**
 * API server using Express.js to get request from React front-end and return
 * response from chaincode
 * @author Thai Hoang Tam
 */
async function main(): Promise<void> {
  // run the fabric gateway to connect to the HF
  fabric.main().catch(error => {
    console.error('******** FAILED to run the fabric application:', error)
    process.exitCode = 1
  })

  app.listen(port, () => {
    console.log(`API server running on ${host}`)
  })

  // to get req.body as a JSON object
  app.use(bodyParser.json())
  app.use(function (req: Request, res: Response, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000') // update to match the domain you will make the request from
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, X-API-KEY'
    )
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, DELETE'
    )
    next()
  })

  app.use('/api/assets', assetsRouter)
  app.use('/api/users', usersRouter)
  // For everything else
  app.use((_req, res) =>
    res.status(NOT_FOUND).json({
      status: NOT_FOUND,
      timestamp: new Date().toISOString()
    })
  )
}

main().catch(error => {
  console.error('******** FAILED to run the application:', error)
  process.exitCode = 1
})
