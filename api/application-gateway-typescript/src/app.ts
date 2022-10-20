/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as grpc from '@grpc/grpc-js'
import {
  connect,
  Contract,
  Identity,
  Signer,
  signers
} from '@hyperledger/fabric-gateway'
import * as crypto from 'crypto'
import { promises as fs } from 'fs'
import * as path from 'path'
import { TextDecoder } from 'util'

const channelName = envOrDefault('CHANNEL_NAME', 'mychannel')
const chaincodeName = envOrDefault('CHAINCODE_NAME', 'basic')
const mspId = envOrDefault('MSP_ID', 'Org1MSP')

// Path to crypto materials.
const cryptoPath = envOrDefault(
  'CRYPTO_PATH',
  path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'network',
    'organizations',
    'peerOrganizations',
    'org1.example.com'
  )
)

// Path to user private key directory.
const keyDirectoryPath = envOrDefault(
  'KEY_DIRECTORY_PATH',
  path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore')
)

// Path to user certificate.
const certPath = envOrDefault(
  'CERT_PATH',
  path.resolve(
    cryptoPath,
    'users',
    'User1@org1.example.com',
    'msp',
    'signcerts',
    'cert.pem'
  )
)

// Path to peer tls certificate.
const tlsCertPath = envOrDefault(
  'TLS_CERT_PATH',
  path.resolve(cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt')
)

// Gateway peer endpoint.
const peerEndpoint = envOrDefault('PEER_ENDPOINT', 'localhost:7051')

// Gateway peer SSL host name override.
const peerHostAlias = envOrDefault('PEER_HOST_ALIAS', 'peer0.org1.example.com')

const utf8Decoder = new TextDecoder()
let contract: Contract
export async function main(): Promise<void> {
  await displayInputParameters()

  // The gRPC client connection should be shared by all Gateway connections to this endpoint.
  const client = await newGrpcConnection()

  const gateway = connect({
    client,
    identity: await newIdentity(),
    signer: await newSigner(),
    // Default timeouts for different gRPC calls
    evaluateOptions: () => {
      return { deadline: Date.now() + 50000 } // 5 seconds
    },
    endorseOptions: () => {
      return { deadline: Date.now() + 150000 } // 15 seconds
    },
    submitOptions: () => {
      return { deadline: Date.now() + 5000 } // 5 seconds
    },
    commitStatusOptions: () => {
      return { deadline: Date.now() + 60000 } // 1 minute
    }
  })

  try {
    // Get a network instance representing the channel where the smart contract is deployed.
    const network = gateway.getNetwork(channelName)

    // Get the smart contract from the network.
    contract = network.getContract(chaincodeName)

    // Initialize a set of asset data on the ledger using the chaincode 'InitLedger' function.
    await initLedger()
  } finally {
    // gateway.close()
    // client.close()
  }
}

async function newGrpcConnection(): Promise<grpc.Client> {
  const tlsRootCert = await fs.readFile(tlsCertPath)
  const tlsCredentials = grpc.credentials.createSsl(tlsRootCert)
  return new grpc.Client(peerEndpoint, tlsCredentials, {
    'grpc.ssl_target_name_override': peerHostAlias
  })
}

async function newIdentity(): Promise<Identity> {
  const credentials = await fs.readFile(certPath)
  return { mspId, credentials }
}

async function newSigner(): Promise<Signer> {
  const files = await fs.readdir(keyDirectoryPath)
  const keyPath = path.resolve(keyDirectoryPath, files[0])
  const privateKeyPem = await fs.readFile(keyPath)
  const privateKey = crypto.createPrivateKey(privateKeyPem)
  return signers.newPrivateKeySigner(privateKey)
}

/**
 * This type of transaction would typically only be run once by an application the first time it was started after its
 * initial deployment. A new version of the chaincode deployed later would likely not need to run an "init" function.
 */
export async function initLedger(): Promise<void> {
  console.log(
    '\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger'
  )

  await contract.submitTransaction('InitLedger')

  console.log('*** Transaction committed successfully')
}

/**
 * Evaluate a transaction to query ledger state.
 * @author Thai Hoang Tam
 * @return
 */
export async function getAllAssets(): Promise<string> {
  console.log('Get all assets')
  const resultBytes = await contract.evaluateTransaction('GetAllAssets')
  const resultJson = utf8Decoder.decode(resultBytes)
  const result = JSON.parse(resultJson)
  // console.log('*** Result:', result)
  return result
}

/**
 * Submit a transaction synchronously, blocking until it has been committed to the ledger.
 * @author Thai Hoang Tam
 * @param assetID
 */
export async function createAsset(
  // contract: Contract,
  assetID: string,
  area: string,
  location: string
): Promise<void> {
  try {
    console.log('Create Asset')
    await contract.submitTransaction('CreateAsset', assetID, area, location)
    console.log('*** Transaction committed successfully')
  } catch (error) {
    console.log(error)
  }
}

/**
 * Create a new user with a starting balance
 * @author Thai Hoang Tam
 * @param userID
 * @param balance
 * @returns
 */
export async function createUser(userID: string, balance: string) {
  console.log('Create user')
  const resultBytes = await contract.submitTransaction(
    'CreateAsset',
    userID,
    balance
  )
  const resultJson = utf8Decoder.decode(resultBytes)
  const result = JSON.parse(resultJson)
  console.log('*** Result:', result)
  return result
}

/**
 * Submit transaction asynchronously, allowing the application to process the smart contract response (e.g. update a UI)
 * while waiting for the commit notification.
 */
export async function transferAssetAsync(
  // contract: Contract,
  assetID: string
): Promise<void> {
  console.log(
    '\n--> Async Submit Transaction: TransferAsset, updates existing asset owner'
  )

  const commit = await contract.submitAsync('TransferAsset', {
    arguments: [assetID, 'Saptha']
  })
  const oldOwner = utf8Decoder.decode(commit.getResult())

  console.log(
    `*** Successfully submitted transaction to transfer ownership from ${oldOwner} to Saptha`
  )
  console.log('*** Waiting for transaction commit')

  const status = await commit.getStatus()
  if (!status.successful) {
    throw new Error(
      `Transaction ${status.transactionId} failed to commit with status code ${status.code}`
    )
  }

  console.log('*** Transaction committed successfully')
}

/**
 * Return an asset read from world state
 * @author Thai Hoang Tam
 * @param assetID
 * @returns
 */
export async function readAsset(
  // contract: Contract,
  assetID: string
): Promise<string> {
  console.log('Read Asset')
  const resultBytes = await contract.evaluateTransaction('ReadAsset', assetID)
  const resultJson = utf8Decoder.decode(resultBytes)
  console.log(resultJson)
  const result = JSON.parse(resultJson)
  console.log('*** Result:', result)
  return result
}

export async function deleteAsset(assetID: string) {
  console.log('Delete asset')
  const resultBytes = await contract.submitTransaction('DeleteAsset', assetID)
  const resultJson = utf8Decoder.decode(resultBytes)
  const result = JSON.parse(resultJson)
  console.log('*** Result:', result)
  return result
}

export async function assetExists(assetID: string): Promise<boolean> {
  console.log('Asset Exist')
  const resultBytes = await contract.evaluateTransaction('AssetExists', assetID)
  const resultJson = utf8Decoder.decode(resultBytes)
  const result = JSON.parse(resultJson)
  console.log('*** Result:', result)
  return result
}

export async function updateAsset(assetID: string) {
  console.log('Update Asset')
  const resultBytes = await contract.evaluateTransaction('UpdateUser', assetID)
  const resultJson = utf8Decoder.decode(resultBytes)
  const result = JSON.parse(resultJson)
  console.log('*** Result:', result)
  return result
}

export async function updateUser(assetID: string): Promise<string> {
  console.log('Update User')
  const resultBytes = await contract.evaluateTransaction('UpdateUser', assetID)
  const resultJson = utf8Decoder.decode(resultBytes)
  const result = JSON.parse(resultJson)
  console.log('*** Result:', result)
  return result
}

/**
 * envOrDefault() will return the value of an environment variable, or a default value if the variable is undefined.
 */
function envOrDefault(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue
}

/**
 * displayInputParameters() will print the global scope parameters used by the main driver routine.
 */
async function displayInputParameters(): Promise<void> {
  console.log(`channelName:       ${channelName}`)
  console.log(`chaincodeName:     ${chaincodeName}`)
  console.log(`mspId:             ${mspId}`)
  console.log(`cryptoPath:        ${cryptoPath}`)
  console.log(`keyDirectoryPath:  ${keyDirectoryPath}`)
  console.log(`certPath:          ${certPath}`)
  console.log(`tlsCertPath:       ${tlsCertPath}`)
  console.log(`peerEndpoint:      ${peerEndpoint}`)
  console.log(`peerHostAlias:     ${peerHostAlias}`)
}