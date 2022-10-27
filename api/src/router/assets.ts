import express, { Request, Response, Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as fabric from '../fabricFunctions'
const { ACCEPTED, BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes

export const assetsRouter: Router = express.Router()

/**
 * Get all assets
 * @author Thai Hoang Tam, Nguyen Khoa
 */
assetsRouter.get('/getAll', async (req: Request, res: Response) => {
  try {
    const msp = <string>req.user
    const contract = req.app.locals[msp]
    const assets = await fabric.getAllAssets(contract)
    return res.status(ACCEPTED).send(assets)
  } catch (error) {
    console.log(error)
    return res.status(INTERNAL_SERVER_ERROR).send(error)
  }
})

/**
 * Read asset
 * @author Thai Hoang Tam, Nguyen Khoa
 */
assetsRouter.get('/read', async (req, res) => {
  try {
    const query = req.query
    const id = <string>query['id']
    const msp = <string>req.user
    const contract = req.app.locals[msp]
    if (!id) {
      return res.status(BAD_REQUEST).send('Invalid query to read asset')
    }
    console.log(id)
    const asset = await fabric.readAsset(contract, id)
    return res.status(ACCEPTED).send(asset)
  } catch (error) {
    console.log(error)
    return res.status(INTERNAL_SERVER_ERROR).send('Fail to read asset')
  }
})

/**
 * Check if asset exists
 * @author Thai Hoang Tam, Nguyen Khoa
 */
assetsRouter.get('/exists', async (req, res) => {
  try {
    const query = req.query
    const id = <string>query['id']
    const msp = <string>req.user
    const contract = req.app.locals[msp]
    if (!id) {
      res.status(BAD_REQUEST).send('Invalid query to check asset exists')
    }
    console.log(id)
    const asset = await fabric.assetExists(contract, id)
    res.status(ACCEPTED).send(asset)
  } catch (error) {
    console.log(error)
    res.status(INTERNAL_SERVER_ERROR).send(error)
  }
})

/**
 * Delete asset
 * @author Thai Hoang Tam, Nguyen Khoa
 */
assetsRouter.delete('/delete', async (req, res) => {
  try {
    const query = req.query
    const id: string = <string>query['id']
    const msp = <string>req.user
    const contract = req.app.locals[msp]['public']
    if (!id) {
      return res.status(BAD_REQUEST).send('Invalid query format')
    }
    const result = await fabric.deleteAsset(contract, id)
    console.log(result)
    return res.status(ACCEPTED).send(result)
  } catch (error) {
    console.log(error)
    return res.status(INTERNAL_SERVER_ERROR).send(error)
  }
})
