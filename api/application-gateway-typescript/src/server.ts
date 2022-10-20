import express, { Express, Request, Response } from 'express'
import * as fabric from './app'
import dotenv from 'dotenv'
dotenv.config()

const port = process.env.PORT
const host = `localhost:${port}`
const app: Express = express()
async function main(): Promise<void> {
  fabric.main().catch(error => {
    console.error('******** FAILED to run the application:', error)
    process.exitCode = 1
  })

  app.listen(port, () => {
    console.log(`API server running on ${host}`)
  })

  // get all assets
  app.get('/api/assets/getAll', async (req: Request, res: Response) => {
    console.log('Get all assets called')
    try {
      res.set('Access-Control-Allow-Origin', '*')
      fabric.getAllAssets().then(asset => {
        console.log(asset)
        return res.send(asset)
      })
    } catch (error) {
      console.log(error)
    }
  })

  // read assets
  app.get('/api/assets/read', async (req, res) => {
    try {
      res.set('Access-Control-Allow-Origin', '*')
      const query: any = req.query
      const assetID = query['assetID']
      if (assetID != undefined) {
        console.log(assetID)
        const asset = await fabric.readAssetByID(assetID)
        res.send(asset)
      } else {
        res.send('Invalid query to read asset')
      }
    } catch (error) {
      console.log(error)
      res.send('Fail to read asset')
    }
  })

  // asset exists
  app.get('/api/assets/exists', async (req, res) => {
    try {
      res.set('Access-Control-Allow-Origin', '*')
      const query: any = req.query
      const assetID = query['assetID']
      if (assetID != undefined) {
        console.log(assetID)
        const asset = await fabric.assetExists(assetID)
        res.send(asset)
      } else {
        res.send('Invalid query to read asset')
      }
    } catch (error) {
      console.log(error)
      res.send('Fail to read asset')
    }
  })

  // create asset
  app.post('/api/assets/create', async (req: Request, res: Response) => {
    const query = req.query
    const assetID: string = <string>query['assetID']
    const area = query['area']
    const location = query['location']
    const roomList = query['roomList']
    // const asset = await fabric.createAsset(assetID, area, location, roomList)
  })

  // create user
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
      res.send('')
    }
  })

  app.put('/api', (req, res) => {
    console.log(req.params)
    return res.send('Received a PUT HTTP method')
  })

  // delete asset
  app.delete('/api/assets/delete', async (req, res) => {
    try {
      res.set('Access-Control-Allow-Origin', '*')
      const query: any = req.query
      const assetID = query['assetID']
      if (assetID != undefined) {
        console.log(assetID)
        const asset = await fabric.deleteAsset(assetID)
        res.send(asset)
      } else {
        res.send('Invalid query to read asset')
      }
    } catch (error) {
      console.log(error)
      res.send('Fail to read asset')
    }
  })
}

main().catch(error => {
  console.error('******** FAILED to run the application:', error)
  process.exitCode = 1
})
