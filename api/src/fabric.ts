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
import * as fabric from './fabricFunctions'
import * as token from './tokenFunctions'
import { env } from './env'

const channelName = env.CHANNEL_NAME
const channelNameBusiness = env.CHANNEL_NAME_BUSINESS
const chaincodeName = env.CHAINCODE_NAME
const chaincodeNameBusiness = env.CHAINCODE_NAME_BUSINESS
const mspId = env.MSP_ID_ORG1

// Path to crypto materials.
const cryptoPath = envOrDefault(
  'CRYPTO_PATH',
  path.resolve(
    __dirname,
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

const keyDirectoryPathBusiness = envOrDefault(
  'KEY_DIRECTORY_PATH',
  path.resolve(
    cryptoPath,
    'users',
    'minter@org1.example.com',
    'msp',
    'keystore'
  )
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
// Path to user certificate.
const certPathMinter = envOrDefault(
  'CERT_PATH',
  path.resolve(
    cryptoPath,
    'users',
    'minter@org1.example.com',
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

export let contract: Contract
export let contractBusiness: Contract
export async function main(): Promise<void> {
  await displayInputParameters()

  // The gRPC client connection should be shared by all Gateway connections to this endpoint.
  const client = await newGrpcConnection(
    tlsCertPath,
    peerEndpoint,
    peerHostAlias
  )

  const gateway = connect({
    client,
    identity: await newIdentity(certPath),
    signer: await newSigner(keyDirectoryPath),
    // Default timeouts for different gRPC calls
    evaluateOptions: () => {
      return { deadline: Date.now() + 5000 } // 5 seconds
    },
    endorseOptions: () => {
      return { deadline: Date.now() + 15000 } // 15 seconds
    },
    submitOptions: () => {
      return { deadline: Date.now() + 5000 } // 5 seconds
    },
    commitStatusOptions: () => {
      return { deadline: Date.now() + 60000 } // 1 minute
    }
  })

  const gatewayMinter = connect({
    client,
    identity: await newIdentity(certPathMinter),
    signer: await newSigner(keyDirectoryPathBusiness),
    // Default timeouts for different gRPC calls
    evaluateOptions: () => {
      return { deadline: Date.now() + 5000 } // 5 seconds
    },
    endorseOptions: () => {
      return { deadline: Date.now() + 15000 } // 15 seconds
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
    const businessNerwork = gatewayMinter.getNetwork(channelNameBusiness)
    contractBusiness = businessNerwork.getContract(chaincodeNameBusiness)

    // Get the smart contract from the network.
    contract = network.getContract(chaincodeName)

    // Initialize a set of asset data on the ledger using the chaincode 'InitLedger' function.
    await fabric.initLedger(contract)
    await fabric.canTransferRealEstate(
      contract,
      'asset1',
      'x509::/C=US/ST=North Carolina/O=Hyperledger/OU=client/CN=minter::/C=US/ST=North Carolina/L=Durham/O=org1.example.com/CN=ca.org1.example.com',
      'x509::/C=US/ST=North Carolina/O=Hyperledger/OU=client/CN=recipient::/C=UK/ST=Hampshire/L=Hursley/O=org2.example.com/CN=ca.org2.example.com',
      '10'
    )
    // await token.Initialize(contractBusiness, 'CW', 'CW', '2')
    await token.Mint(contractBusiness, '500')
    await token.canTransferToken(
      contractBusiness,
      // 'x509::/C=US/ST=North Carolina/O=Hyperledger/OU=client/CN=minter::/C=US/ST=North Carolina/L=Durham/O=org1.example.com/CN=ca.org1.example.com',
      'x509::/C=US/ST=North Carolina/O=Hyperledger/OU=client/CN=recipient::/C=UK/ST=Hampshire/L=Hursley/O=org2.example.com/CN=ca.org2.example.com',
      '100'
    )
    await token.burn(contractBusiness, '50')
    await token.clientAccountBalance(contractBusiness)
    await token.clientAccountID(contractBusiness)
    await token.transferToken(
      contractBusiness,
      'x509::/C=US/ST=North Carolina/O=Hyperledger/OU=client/CN=recipient::/C=UK/ST=Hampshire/L=Hursley/O=org2.example.com/CN=ca.org2.example.com',
      '10'
    )
  } finally {
    // gateway.close()
    // client.close()
  }
}

async function newGrpcConnection(
  tlsCertPath: string,
  peerEndpoint: string,
  peerHostAlias: string
): Promise<grpc.Client> {
  const tlsRootCert = await fs.readFile(tlsCertPath)
  const tlsCredentials = grpc.credentials.createSsl(tlsRootCert)
  return new grpc.Client(peerEndpoint, tlsCredentials, {
    'error.ssl_target_name_override': peerHostAlias
  })
}

async function newIdentity(certPath: string): Promise<Identity> {
  const credentials = await fs.readFile(certPath)
  return { mspId, credentials }
}

async function newSigner(keyDirectoryPath: string): Promise<Signer> {
  const files = await fs.readdir(keyDirectoryPath)
  const keyPath = path.resolve(keyDirectoryPath, files[0])
  const privateKeyPem = await fs.readFile(keyPath)
  const privateKey = crypto.createPrivateKey(privateKeyPem)
  return signers.newPrivateKeySigner(privateKey)
}

function envOrDefault(key: string, defaultValue: string) {
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
