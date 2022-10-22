import express, { Express, Request, Response } from 'express'
import * as fabric from './app'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
dotenv.config()

const port = process.env.PORT
const host = `localhost:${port}`
const app: Express = express()
enum statusCode {
  successful = 200,
  serverFail = 400,
  clientFail = 500
}
/**
 *
 */
async function main(): Promise<void> {
  fabric.main().catch(error => {
    console.error('******** FAILED to run the application:', error)
    process.exitCode = 1
  })

  app.listen(port, () => {
    console.log(`API server running on ${host}`)
  })

  // to get req.body as a JSON object
  app.use(bodyParser.json())
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000') // update to match the domain you will make the request from
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, DELETE'
    )
    next()
  })
  /**
   * Get all assets
   * @author Thai Hoang Tam
   */
  app.get('/api/assets/getAll', async (req: Request, res: Response) => {
    console.log('Get all assets')
    try {
      const assets = await fabric.getAllAssets()
      // console.log(assets)
      return res.send(assets)
    } catch (error) {
      console.log(error)
      return res.send('Fail to get all assets')
    }
  })

  /**
   * Read assets
   * @author Thai Hoang Tam
   */
  app.get('/api/assets/read', async (req, res) => {
    try {
      // res.set('Access-Control-Allow-Origin', '*')
      res.setHeader('Content-Type', 'application/json')
      const query = req.query
      const assetID = <string>query['assetID']
      if (assetID != undefined) {
        console.log(assetID)
        const asset = await fabric.readAsset(assetID)
        res.send(asset)
      } else {
        res.send('Invalid query to read asset')
      }
    } catch (error) {
      console.log(error)
      res.send('Fail to read asset')
    }
  })

  /**
   * Check if asset exists
   * @author Thai Hoang Tam
   */
  app.get('/api/assets/exists', async (req, res) => {
    try {
      // res.set('Access-Control-Allow-Origin', '*')
      const query = req.query
      const assetID = <string>query['assetID']
      if (assetID != undefined) {
        console.log(assetID)
        const asset = await fabric.assetExists(assetID)
        res.send(asset)
      } else {
        res.send('Invalid query to check asset exists')
      }
    } catch (error) {
      console.log(error)
      res.send('Fail to check asset exists')
    }
  })

  /**
   * Create new asset (not yet work because still can't make Json object from req.body)
   * @author Thai Hoang Tam
   */
  app.post('/api/assets/create', async (req: Request, res: Response) => {
    try {
      console.log('Server Create Asset')
      const bodyJson = req.body
      console.log(bodyJson)
      const assetID = bodyJson.assetID
      console.log(assetID)

      const area = bodyJson.area
      console.log(area)

      const location = bodyJson.location
      console.log(location)

      const roomList = JSON.stringify(bodyJson.roomList)
      console.log(roomList)

      const owners = JSON.stringify(bodyJson.owners)
      console.log(owners)

      const result = await fabric.createAsset(
        assetID,
        roomList,
        area,
        location,
        owners
      )
      console.log(result)

      result != undefined ? res.sendStatus(200) : res.sendStatus(500)
    } catch (error) {
      console.log(error)
      res.send(400)
    }
  })

  /**
   * Create user
   * @author Thai Hoang Tam
   */
  app.post('/api/users/create', async (req: Request, res: Response) => {
    try {
      console.log(req.body)
      const query = req.query
      const userID: string = <string>query['userID']
      const balance: string = <string>query['balance']
      if (userID != undefined && balance != undefined) {
        const user = await fabric.createUser(userID, balance)
        return res.send(user)
      } else {
        return res.sendStatus(400)
      }
    } catch (error) {
      console.log(error)
      res.send(500)
    }
  })

  app.put('/api', (req, res) => {
    console.log(req.params)
    return res.send('Received a PUT HTTP method')
  })

  /**
   * Delete asset
   * @author Thai Hoang Tam
   */
  app.delete('/api/assets/delete', async (req, res) => {
    try {
      console.log('Delete Asset')
      res.set('Access-Control-Allow-Origin', '*')
      const query = req.query
      const assetID: string = <string>query['assetID']
      if (assetID != undefined) {
        console.log(assetID)
        fabric.deleteAsset(assetID)
        res.sendStatus(200)
      } else {
        res.sendStatus(400)
      }
    } catch (error) {
      console.log(error)
      res.sendStatus(500)
    }
  })
}

main().catch(error => {
  console.error('******** FAILED to run the application:', error)
  process.exitCode = 1
})
