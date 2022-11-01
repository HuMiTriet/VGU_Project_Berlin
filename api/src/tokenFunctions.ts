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
  let result: boolean
  try {
    console.log('*** Transfer Token')
    const commit = await contract.submitAsync('Transfer', {
      arguments: [to, value]
    })
    result = <boolean>(<unknown>utf8Decoder.decode(commit.getResult()))
    // const status = await commit.getStatus()
    // if (!status.successful) {
    //   throw new Error(
    //     `Transaction ${status.transactionId} failed to commit with status code ${status.code}`
    //   )
    // }
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
  to: string,
  value: string
): Promise<string> {
  try {
    console.log('*** Can Transfer Token?')
    const commit = await contract.submitTransaction('CanTransfer', to, value)
    const result = utf8Decoder.decode(commit)
    console.log('*** Result:', result)
    return JSON.stringify(result)
  } catch (error: unknown) {
    console.log('*** Error:', error)
    throw error
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
  name: string,
  symbol: string,
  decimals: string
): Promise<void> {
  try {
    console.log('*** Initialize Token')
    await contract.submitTransaction('Initialize', name, symbol, decimals)
    console.log('*** Init token successfully')
  } catch (error) {
    console.log(error)
  }
}

/**
 * Mint creates new tokens and adds them to minter's account balance
 * @author Nguyen Khoa
 * @param contract
 * @param amount amount of tokens to be minted
 */
export async function Mint(
  contract: Contract,
  amount: string
): Promise<boolean> {
  console.log('*** Mint Token')
  await contract.submitTransaction('Mint', amount)
  console.log('*** Mint token successfully')
  return true
}

/**
 * Burn token
 * @author Thai Hoang Tam
 * @param contract
 * @param amount
 * @returns
 */
export async function burn(
  contract: Contract,
  amount: string
): Promise<string> {
  try {
    console.log('Burn')
    const resultBytes = await contract.submitTransaction('Burn', amount)
    const resultJson = utf8Decoder.decode(resultBytes)
    const result = JSON.parse(resultJson)
    console.log('*** Result:', result)
    return result
  } catch (error: unknown) {
    console.log('*** Error:', error)
    return <string>error
  }
}

/**
 * Get client account balance
 * @author Thai Hoang Tam
 * @param contract
 * @returns
 */
export async function clientAccountBalance(
  contract: Contract
): Promise<string> {
  try {
    console.log('ClientAccountBalance')
    const resultBytes = await contract.submitTransaction('ClientAccountBalance')
    const resultJson = utf8Decoder.decode(resultBytes)
    const result = JSON.stringify(resultJson)
    console.log('*** Result:', result)
    return result
  } catch (error: unknown) {
    console.log('*** Error:', error)
    return <string>error
  }
}

/**
 * Get client account ID
 * @author Thai Hoang Tam
 * @param contract
 * @returns
 */
export async function clientAccountID(contract: Contract): Promise<string> {
  try {
    console.log('ClientAccountID')
    const resultBytes = await contract.submitTransaction('ClientAccountID')
    const resultJson = utf8Decoder.decode(resultBytes)
    const result = JSON.stringify(resultJson)
    console.log('*** Result:', result)
    return result
  } catch (error: unknown) {
    console.log('*** Error:', error)
    return <string>error
  }
}
