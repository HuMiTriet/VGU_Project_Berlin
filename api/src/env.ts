import dotenv from 'dotenv'
import * as path from 'path'
dotenv.config()

export const env = {
  HTTP_PORT: readFromEnv('HTTP_PORT') || '3001',
  HTTPS_PORT: readFromEnv('HTTPS_PORT') || '3002',
  ORG1_API_KEY: process.env.ORG1_API_KEY || 'API1',
  MSP_ID_ORG1: readFromEnv('MSP_ID_ORG1') || 'Org1MSP',
  ORG2_API_KEY: readFromEnv('ORG2_API_KEY') || 'API2',
  MSP_ID_ORG2: readFromEnv('MSP_ID_ORG2') || 'Org2MSP',
  ORG3_API_KEY: readFromEnv('ORG3_API_KEY') || 'API3',
  MSP_ID_ORG3: readFromEnv('MSP_ID_ORG3') || 'Org3MSP',
  CHANNEL_NAME: readFromEnv('CHANNEL_NAME') || 'mychannel',
  CHANNEL_NAME_BUSINESS: readFromEnv('CHANNEL_NAME_BUSINESS') || 'business',
  CHAINCODE_NAME: readFromEnv('CHAINCODE_NAME') || 'basic',
  CHAINCODE_NAME_BUSINESS:
    readFromEnv('CHAINCODE_NAME_BUSINESS') || 'token_erc20',
  CRYPTO_PATH1:
    readFromEnv('CRYPTO_PATH1') ||
    path.resolve(
      __dirname,
      '..',
      '..',
      'network',
      'organizations',
      'peerOrganizations',
      'org1.example.com'
    )
}

function readFromEnv(key: string): string | undefined {
  return process.env[key]
}
