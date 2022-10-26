/*
 * SPDX-License-Identifier: Apache-2.0
 */
// Deterministic JSON.stringify()
import {
  Context,
  Contract,
  Info,
  Returns,
  Transaction
} from 'fabric-contract-api'

@Info({
  title: 'AssetTransfer',
  description:
    'Smart contract for Reading, Deleting, and Checking assets availability'
})
export class AssetContractOther extends Contract {
  /**
   * ReadAsset returns the asset stored in the world state with given id.
   * @param {Context} ctx the transaction context
   * @param {string} AssetID the id of the asset (unique identifier)
   *  @returns {Promise<string>} the json object of the asset (stored in string format)
   * @author Đinh Minh Hoàng
   */
  @Transaction(false)
  @Returns('string')
  public async ReadAsset(ctx: Context, AssetID: string): Promise<string> {
    const assetJSON = await ctx.stub.getState(AssetID) // get the asset from chaincode state
    if (!assetJSON || assetJSON.length === 0) {
      throw new Error(`The asset ${AssetID} does not exist`)
    }
    return assetJSON.toString()
  }

  // DeleteAsset deletes an given asset from the world state.
  @Transaction()
  public async DeleteAsset(ctx: Context, AssetID: string): Promise<void> {
    const exists = await this.AssetExists(ctx, AssetID)
    if (!exists) {
      throw new Error(`The asset ${AssetID} does not exist`)
    }
    return ctx.stub.deleteState(AssetID)
  }

  // AssetExists returns true when asset with given ID exists in world state.
  @Transaction(false)
  @Returns('boolean')
  public async AssetExists(ctx: Context, id: string): Promise<boolean> {
    const assetJSON = await ctx.stub.getState(id)
    return assetJSON && assetJSON.length > 0
  }

  // GetAllAssets returns all assets found in the world state.
  @Transaction(false)
  @Returns('string')
  public async GetAllAssets(ctx: Context): Promise<string> {
    const allResults = []
    // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
    const iterator = await ctx.stub.getStateByRange('', '')
    let result = await iterator.next()

    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        'utf8'
      )
      let record
      try {
        record = JSON.parse(strValue)
        //Check if user wants a specific type of Asset (asset, user,.....)
      } catch (err) {
        console.log(err)
        record = strValue
      }

      allResults.push(record)
      result = await iterator.next()
    }
    return JSON.stringify(allResults)
  }
}
