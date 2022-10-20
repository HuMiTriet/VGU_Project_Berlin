import express, { Express, Request, Response } from 'express'
import * as fabric from './app'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
dotenv.config()

const port = process.env.PORT
const host = `localhost:${port}`
const app: Express = express()
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

  app.use(bodyParser.urlencoded({ extended: true }))

  /**
   * Get all assets
   * @author Thai Hoang Tam
   */
  app.get('/api/assets/getAll', async (req: Request, res: Response) => {
    console.log('Get all assets')

    try {
      res.set('Access-Control-Allow-Origin', '*')
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
      res.set('Access-Control-Allow-Origin', '*')
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
      res.set('Access-Control-Allow-Origin', '*')
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
      res.set('Access-Control-Allow-Origin', '*')
      res.setHeader('Content-Type', 'application/json')
      console.log('body' + req.body)
      console.log('JSON parse' + JSON.parse(req.body))
      console.log('JSON string' + JSON.stringify(req.body))
      const query = req.query
      const assetID: string = <string>query['assetID']
      const area = query['area']
      const location = query['location']
      const roomList = query['roomList']
      // const asset = await fabric.createAsset(assetID, area, location, roomList)
      res.send('Create asset successfully')
    } catch (error) {
      console.log(error)
      res.send('Fail to create asset')
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
        return res.send('Invalid query to create user')
      }
    } catch (error) {
      console.log(error)
      res.send('Fail to create user')
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
      res.set('Access-Control-Allow-Origin', '*')
      const query = req.query
      const assetID: string = <string>query['assetID']
      if (assetID != undefined) {
        console.log(assetID)
        const asset = await fabric.deleteAsset(assetID)
        res.send(asset)
      } else {
        res.send('Invalid query to delete asset')
      }
    } catch (error) {
      console.log(error)
      res.send('Fail to delete asset')
    }
  })
}

main().catch(error => {
  console.error('******** FAILED to run the application:', error)
  process.exitCode = 1
})
