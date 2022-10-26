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

import { UserContract } from './userContract'
import { RealEstateContract } from './realEstateContract'
import { AssetContractOther } from './assetContractOther'

@Info({
  title: 'AssetTransfer',
  description: 'Smart contract for trading assets'
})
export class AssetContract extends Contract {
  private userContract: UserContract = new UserContract()
  private realEstateContract: RealEstateContract = new RealEstateContract()
  private assetContractOther: AssetContractOther = new AssetContractOther()

  @Transaction()
  public async InitLedger(ctx: Context): Promise<void> {
    await this.InitLedgerAsset(ctx)
    await this.InitLedgerUser(ctx)
  } // end InitLedger

  @Transaction()
  public async InitLedgerAsset(ctx: Context): Promise<void> {
    await this.realEstateContract.InitLedgerRealEstate(ctx)
  }

  @Transaction()
  public async InitLedgerUser(ctx: Context): Promise<void> {
    await this.userContract.InitLedgerUser(ctx)
  }

  @Transaction()
  public async CreateRealEstate(
    ctx: Context,
    id: string,
    name: string,
    roomListString: string,
    areaString: string,
    location: string,
    OwnersString: string,
    membershipThresholdString: string
  ) {
    await this.realEstateContract.CreateRealEstate(
      ctx,
      id,
      name,
      roomListString,
      areaString,
      location,
      OwnersString,
      membershipThresholdString
    )
  }

  @Transaction()
  public async CreateUser(ctx: Context, id: string, name: string) {
    await this.userContract.CreateUser(ctx, id, name)
  }

  // UpdateAsset updates an existing asset in the world state with provided parameters.
  @Transaction()
  public async UpdateRealEstate(
    ctx: Context,
    id: string,
    name: string,
    roomListString: string, // RoomType
    areaString: string, // number
    location: string,
    ownersString: string,
    membershipThresholdString: string
  ): Promise<void> {
    await this.realEstateContract.UpdateRealEstate(
      ctx,
      id,
      name,
      roomListString,
      areaString,
      location,
      ownersString,
      membershipThresholdString
    )
  }

  @Transaction()
  public async UpdateUser(
    ctx: Context,
    id: string,
    name: string,
    membershipScoreString: string
  ): Promise<void> {
    await this.userContract.UpdateUser(ctx, id, name, membershipScoreString)
  }

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
    return await this.assetContractOther.ReadAsset(ctx, AssetID)
  }

  // DeleteAsset deletes an given asset from the world state.
  @Transaction()
  public async DeleteAsset(ctx: Context, AssetID: string): Promise<void> {
    await this.assetContractOther.DeleteAsset(ctx, AssetID)
  }

  // AssetExists returns true when asset with given ID exists in world state.
  @Transaction(false)
  @Returns('boolean')
  public async AssetExists(ctx: Context, id: string): Promise<boolean> {
    return this.assetContractOther.AssetExists(ctx, id)
  }

  // TransferAsset updates the owner field of asset with given id in the world state, and returns the old owner.
  @Transaction()
  public async TransferRealEstate(
    ctx: Context,
    AssetID: string,
    sellerID: string,
    buyerID: string,
    buyPercentageString: string
  ): Promise<string> {
    return await this.realEstateContract.TransferRealEstate(
      ctx,
      AssetID,
      sellerID,
      buyerID,
      buyPercentageString
    )
  }

  // GetAllAssets returns all assets found in the world state.
  @Transaction(false)
  @Returns('string')
  public async GetAllAssets(ctx: Context): Promise<string> {
    return await this.assetContractOther.GetAllAssets(ctx)
  }

  // GetAllAssets returns all assets found in the world state.
  @Transaction(false)
  @Returns('string')
  public async GetAllRealEstate(ctx: Context): Promise<string> {
    return await this.realEstateContract.GetAllRealEstate(ctx)
  }
}
