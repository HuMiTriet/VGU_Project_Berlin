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
const chaincodeNameBasic = env.CHAINCODE_NAME_BASIC
const chaincodeNameToken = env.CHAINCODE_NAME_TOKEN
const mspId1 = env.MSP_ID_ORG1
const mspId2 = env.MSP_ID_ORG2
const mspId3 = env.MSP_ID_ORG3

// Path to crypto materials.
const cryptoPath1 = envOrDefault(
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
const cryptoPath2 = envOrDefault(
  'CRYPTO_PATH',
  path.resolve(
    __dirname,
    '..',
    '..',
    'network',
    'organizations',
    'peerOrganizations',
    'org2.example.com'
  )
)
const cryptoPath3 = envOrDefault(
  'CRYPTO_PATH',
  path.resolve(
    __dirname,
    '..',
    '..',
    'network',
    'organizations',
    'peerOrganizations',
    'org3.example.com'
  )
)

// Path to user private key directory.
const keyDirectoryPath1 = envOrDefault(
  'KEY_DIRECTORY_PATH',
  path.resolve(
    cryptoPath1,
    'users',
    'User1@org1.example.com',
    'msp',
    'keystore'
  )
)
const keyDirectoryPath2 = envOrDefault(
  'KEY_DIRECTORY_PATH',
  path.resolve(
    cryptoPath2,
    'users',
    'User1@org2.example.com',
    'msp',
    'keystore'
  )
)
const keyDirectoryPath3 = envOrDefault(
  'KEY_DIRECTORY_PATH',
  path.resolve(
    cryptoPath3,
    'users',
    'User1@org3.example.com',
    'msp',
    'keystore'
  )
)

const keyDirectoryPathBusiness1 = envOrDefault(
  'KEY_DIRECTORY_PATH',
  path.resolve(
    cryptoPath1,
    'users',
    'minter@org1.example.com',
    'msp',
    'keystore'
  )
)
const keyDirectoryPathBusiness2 = envOrDefault(
  'KEY_DIRECTORY_PATH',
  path.resolve(
    cryptoPath2,
    'users',
    'minter@org2.example.com',
    'msp',
    'keystore'
  )
)
const keyDirectoryPathBusiness3 = envOrDefault(
  'KEY_DIRECTORY_PATH',
  path.resolve(
    cryptoPath3,
    'users',
    'minter@org3.example.com',
    'msp',
    'keystore'
  )
)

// Path to user certificate.
const certPath1 = envOrDefault(
  'CERT_PATH',
  path.resolve(
    cryptoPath1,
    'users',
    'User1@org1.example.com',
    'msp',
    'signcerts',
    'cert.pem'
  )
)
const certPathMinter1 = envOrDefault(
  'CERT_PATH',
  path.resolve(
    cryptoPath1,
    'users',
    'minter@org1.example.com',
    'msp',
    'signcerts',
    'cert.pem'
  )
)
const certPath2 = envOrDefault(
  'CERT_PATH',
  path.resolve(
    cryptoPath2,
    'users',
    'User1@org2.example.com',
    'msp',
    'signcerts',
    'cert.pem'
  )
)
const certPathMinter2 = envOrDefault(
  'CERT_PATH2',
  path.resolve(
    cryptoPath2,
    'users',
    'minter@org2.example.com',
    'msp',
    'signcerts',
    'cert.pem'
  )
)
const certPath3 = envOrDefault(
  'CERT_PATH3',
  path.resolve(
    cryptoPath3,
    'users',
    'User1@org3.example.com',
    'msp',
    'signcerts',
    'cert.pem'
  )
)
const certPathMinter3 = envOrDefault(
  'CERT_PATH3',
  path.resolve(
    cryptoPath3,
    'users',
    'minter@org3.example.com',
    'msp',
    'signcerts',
    'cert.pem'
  )
)

// Path to peer tls certificate.
const tlsCertPath1 = envOrDefault(
  'TLS_CERT_PATH1',
  path.resolve(cryptoPath1, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt')
)
const tlsCertPath2 = envOrDefault(
  'TLS_CERT_PATH2',
  path.resolve(cryptoPath2, 'peers', 'peer0.org2.example.com', 'tls', 'ca.crt')
)
const tlsCertPath3 = envOrDefault(
  'TLS_CERT_PATH3',
  path.resolve(cryptoPath3, 'peers', 'peer0.org3.example.com', 'tls', 'ca.crt')
)

// Gateway peer endpoint.
const peerEndpoint1 = envOrDefault('PEER_ENDPOINT1', 'localhost:7051')
const peerEndpoint2 = envOrDefault('PEER_ENDPOINT2', 'localhost:9051')
const peerEndpoint3 = envOrDefault('PEER_ENDPOINT3', 'localhost:11051')

// Gateway peer SSL host name override.
const peerHostAlias1 = envOrDefault(
  'PEER_HOST_ALIAS1',
  'peer0.org1.example.com'
)
const peerHostAlias2 = envOrDefault(
  'PEER_HOST_ALIAS2',
  'peer0.org2.example.com'
)
const peerHostAlias3 = envOrDefault(
  'PEER_HOST_ALIAS3',
  'peer0.org3.example.com'
)

// export let contract1: Contract
export let contractBusinessBasic1: Contract
export let contractBusinessToken1: Contract
export let contractMychannelBasic1: Contract
export let contractMychannelToken1: Contract
export let contractBusinessBasic2: Contract
export let contractBusinessToken2: Contract
export let contractMychannelBasic2: Contract
export let contractMychannelToken2: Contract
export let contractMychannelBasic3: Contract
export let contractMychannelToken3: Contract
// export let contract2: Contract
// export let contractBusiness2: Contract
// export let contract3: Contract
// export let contractBusiness3: Contract
export async function main(): Promise<void> {
  await displayInputParameters()

  // The gRPC client1 connection should be shared by all Gateway connections to this endpoint.
  const client1 = await newGrpcConnection(
    tlsCertPath1,
    peerEndpoint1,
    peerHostAlias1
  )
  const client2 = await newGrpcConnection(
    tlsCertPath2,
    peerEndpoint2,
    peerHostAlias2
  )
  const client3 = await newGrpcConnection(
    tlsCertPath3,
    peerEndpoint3,
    peerHostAlias3
  )

  const gateway1 = connect({
    client: client1,
    identity: await newIdentity(mspId1, certPath1),
    signer: await newSigner(keyDirectoryPath1),
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

  const gateway2 = connect({
    client: client2,
    identity: await newIdentity(mspId2, certPath2),
    signer: await newSigner(keyDirectoryPath2),
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

  const gateway3 = connect({
    client: client3,
    identity: await newIdentity(mspId3, certPath3),
    signer: await newSigner(keyDirectoryPath3),
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

  const gatewayMinter1 = connect({
    client: client1,
    identity: await newIdentity(mspId1, certPathMinter1),
    signer: await newSigner(keyDirectoryPathBusiness1),
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
  const gatewayMinter2 = connect({
    client: client2,
    identity: await newIdentity(mspId2, certPathMinter2),
    signer: await newSigner(keyDirectoryPathBusiness2),
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
  const gatewayMinter3 = connect({
    client: client3,
    identity: await newIdentity(mspId3, certPathMinter3),
    signer: await newSigner(keyDirectoryPathBusiness3),
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
    const network1 = gatewayMinter1.getNetwork(channelName)
    contractMychannelBasic1 = network1.getContract(chaincodeNameBasic)
    contractMychannelToken1 = network1.getContract(chaincodeNameToken)
    const businessNerwork1 = gatewayMinter1.getNetwork(channelNameBusiness)
    contractBusinessBasic1 = businessNerwork1.getContract(chaincodeNameBasic)
    contractBusinessToken1 = businessNerwork1.getContract(chaincodeNameToken)

    const network2 = gatewayMinter2.getNetwork(channelName)
    contractMychannelBasic2 = network2.getContract(chaincodeNameBasic)
    contractMychannelToken2 = network2.getContract(chaincodeNameToken)
    const businessNerwork2 = gatewayMinter2.getNetwork(channelNameBusiness)
    contractBusinessBasic2 = businessNerwork2.getContract(chaincodeNameBasic)
    contractBusinessToken2 = businessNerwork2.getContract(chaincodeNameToken)

    const network3 = gatewayMinter3.getNetwork(channelName)
    contractMychannelBasic3 = network3.getContract(chaincodeNameBasic)
    contractMychannelToken3 = network3.getContract(chaincodeNameToken)

    // Initialize a set of asset data on the ledger using the chaincode 'InitLedger' function.
    const khanhLinh = {
      area: '200',
      id: 'asset19',
      name: 'Bunny :3',
      docType: 'realEstate',
      location: 'Thu Dau Mot',
      owners: [
        {
          isSeller: false,
          ownerID:
            'x509::/C=US/ST=North Carolina/O=Hyperledger/OU=client/CN=minter::/C=UK/ST=Hampshire/L=Hursley/O=org2.example.com/CN=ca.org2.example.com',
          ownershipPercentage: 100,
          sellPercentage: 20,
          sellPrice: 10000,
          sellThreshold: 5
        }
      ],
      roomList: {
        numOfBathroom: 2,
        numOfBedroom: 2,
        numOfDiningroom: 1,
        numOfLivingroom: 1
      },
      membershipThreshold: 1
    }
    const realEstate = {
      area: '200',
      docType: 'realEstate',
      id: 'asset1',
      location: 'Ben Cat',
      membershipThreshold: '0',
      name: 'Beautiful Duplex Apartment',
      owners: JSON.stringify([
        {
          isSeller: true,
          ownerID:
            'x509::/C=US/ST=North Carolina/O=Hyperledger/OU=client/CN=minter::/C=UK/ST=Hampshire/L=Hursley/O=org2.example.com/CN=ca.org2.example.com',
          ownershipPercentage: 100,
          sellPercentage: 50,
          sellPrice: 1000,
          sellThreshold: 5
        }
      ]),
      roomList: JSON.stringify({
        numOfBathroom: 2,
        numOfBedroom: 2,
        numOfDiningroom: 1,
        numOfLivingroom: 1
      })
    }

    console.log('id', realEstate.id)
    console.log('name', realEstate.name)
    console.log('area', realEstate.area)
    console.log('location', realEstate.location)
    console.log('roomList', realEstate.roomList)
    console.log('owners', realEstate.owners)
    console.log(contractMychannelBasic1)

    await fabric.updateRealEstate(
      contractMychannelBasic1,
      realEstate.id,
      realEstate.name,
      realEstate.roomList,
      realEstate.area,
      realEstate.location,
      realEstate.owners,
      realEstate.membershipThreshold
    )

    // await fabric.initLedger(contractMychannelBasic1)
    // await fabric.initLedger(contractBusinessBasic1)
    // await token.Initialize(contractMychannelToken1, 'CW', 'CW', '3')
    // await token.Initialize(contractBusinessToken1, 'CW', 'CW', '3')
    // await token.Mint(contractMychannelToken1, '500')
    // await token.Mint(contractMychannelToken2, '500')
    // await token.Mint(contractMychannelToken3, '500')
    // await token.Mint(contractBusinessToken1, '500')
    // await token.Mint(contractBusinessToken2, '500')
  } finally {
    // gateway1.close()
    // client1.close()
  }
}

async function newGrpcConnection(
  tlsCertPath1: string,
  peerEndpoint: string,
  peerHostAlias: string
): Promise<grpc.Client> {
  const tlsRootCert = await fs.readFile(tlsCertPath1)
  const tlsCredentials = grpc.credentials.createSsl(tlsRootCert)
  return new grpc.Client(peerEndpoint, tlsCredentials, {
    'error.ssl_target_name_override': peerHostAlias
  })
}

async function newIdentity(
  mspId: string,
  certPath1: string
): Promise<Identity> {
  const credentials = await fs.readFile(certPath1)
  return { mspId: mspId, credentials: credentials }
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
  console.log(`chaincodeNameBasic:     ${chaincodeNameBasic}`)
  console.log(`mspId1:            ${mspId1}`)
  console.log(`mspId2:            ${mspId2}`)
  console.log(`mspId3:            ${mspId3}`)
  console.log(`cryptoPath1:        ${cryptoPath1}`)
  console.log(`cryptoPath2:        ${cryptoPath2}`)
  console.log(`cryptoPath3:        ${cryptoPath3}`)
  console.log(`keyDirectoryPath1:  ${keyDirectoryPath1}`)
  console.log(`keyDirectoryPath2:  ${keyDirectoryPath2}`)
  console.log(`keyDirectoryPath3:  ${keyDirectoryPath3}`)
  console.log(`certPath1:          ${certPath1}`)
  console.log(`certPath2:          ${certPath2}`)
  console.log(`certPath3:          ${certPath3}`)
  console.log(`tlsCertPath1:       ${tlsCertPath1}`)
  console.log(`tlsCertPath2:       ${tlsCertPath2}`)
  console.log(`tlsCertPath3:       ${tlsCertPath3}`)
  console.log(`peerEndpoint1:      ${peerEndpoint1}`)
  console.log(`peerEndpoint2:      ${peerEndpoint2}`)
  console.log(`peerEndpoint3:      ${peerEndpoint3}`)
  console.log(`peerHostAlias1:     ${peerHostAlias1}`)
  console.log(`peerHostAlias2:     ${peerHostAlias2}`)
  console.log(`peerHostAlias3:     ${peerHostAlias3}`)
}
