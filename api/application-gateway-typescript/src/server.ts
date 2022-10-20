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

  app.get('/api/assets', async (req: Request, res: Response) => {
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

  app.get('/api/assets', async (req, res) => {
    const query: any = req.query
    const searchQuery = query['q']
    const id = query['id']
    if (searchQuery != undefined && id != undefined) {
      console.log(searchQuery)
      console.log(id)
    } else {
      res.send('Invalid query format')
    }
    return res.send(query)
  })

  app.put('/api', (req, res) => {
    console.log(req.params)
    return res.send('Received a PUT HTTP method')
  })

  app.delete('/api', (req, res) => {
    return res.send('Received a DELETE HTTP method')
  })
}

main().catch(error => {
  console.error('******** FAILED to run the application:', error)
  process.exitCode = 1
})
