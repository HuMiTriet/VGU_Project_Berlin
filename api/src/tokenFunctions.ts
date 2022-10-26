import { Contract } from '@hyperledger/fabric-gateway'
import { TextDecoder } from 'util'
const utf8Decoder = new TextDecoder()

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
    const result = JSON.parse(resultJson)
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
    const result = JSON.parse(resultJson)
    console.log('*** Result:', result)
    return result
  } catch (error: unknown) {
    console.log('*** Error:', error)
    return <string>error
  }
}
