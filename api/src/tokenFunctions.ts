import { Contract } from '@hyperledger/fabric-gateway'
import { TextDecoder } from 'util'
const utf8Decoder = new TextDecoder()

/**
 * Transfer token
 * @author Nguyen Khoa
 * @param contract 
 * @param to The recipient
 * @param value The amount of token to be transferred
 * @returns 
 */
export async function transferToken(
  contract: Contract,
  to: string,
  value: string
): Promise<boolean> {
  let result:boolean
  try {
    console.log('*** Transfer Token')
    const commit = await contract.submitAsync('Transfer', {
      arguments: [to, value]
    })
    result = <boolean><unknown>utf8Decoder.decode(commit.getResult())
    const status = await commit.getStatus()
    if (!status.successful) {
      throw new Error(
        `Transaction ${status.transactionId} failed to commit with status code ${status.code}`
      )
    }
    console.log('*** Result:', result)
    return result
  } catch (error: unknown) {
    console.log('*** Error:', error)
    return false
  }
}

/**
 * @author Nguyen Khoa
 * @param contract 
 * @param from 
 * @param to 
 * @param value 
 * @returns 
 */
export async function canTransferToken(
  contract: Contract,
  from: string,
  to: string,
  value: string
): Promise<boolean> {
  let result:boolean
  try {
    console.log('*** Can Transfer Token?')
    const commit = await contract.submitAsync('canTransfer', {
      arguments: [from, to, value]
    })
    result = <boolean><unknown>utf8Decoder.decode(commit.getResult())
    const status = await commit.getStatus()
    if (!status.successful) {
      throw new Error(
        `Transaction ${status.transactionId} failed to commit with status code ${status.code}`
      )
    }
    console.log('*** Result:', result)
    return result
  } catch (error: unknown) {
    console.log('*** Error:', error)
    return false
  }
}

/**
 * @author Nguyen Khoa
 * @param contract 
 * @param name The name of the token
 * @param symbol The symbol of the token
 * @param decimals The decimals of the token
 * @param totalSupply The totalSupply of the token
 */
export async function Initialize(
  contract: Contract,
  name:string,
  symbol: string,
  decimals: string,
  totalSupply: string): Promise<void> {
  console.log('*** Initialize Token')
  await contract.submitTransaction(
    'Initialize',
    name,
    symbol,
    decimals,
    totalSupply)
  console.log('*** Init token successfully')
}

/**
 * Mint creates new tokens and adds them to minter's account balance
 * @author Nguyen Khoa
 * @param contract 
 * @param amount amount of tokens to be minted
 */
export async function Mint(
  contract: Contract,
  amount:string): Promise<boolean> {
  console.log('*** Mint Token')
  await contract.submitTransaction(
    'Mint',
    amount)
  console.log('*** Mint token successfully')
  return true
}
