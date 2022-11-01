/** * This class is exposed to index file to let user invoke chaincode functions
 *
 */

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

  /**
   * Initialize Assets' data in the world state
   * @param ctx
   * @author Dinh Minh Hoang
   */
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

  /**
   * Function to create a new Real Estate in the world state.
   * Delegates to RealEstateContract
   * @param ctx
   * @param id
   * @param name
   * @param roomListString
   * @param areaString
   * @param location
   * @param OwnersString
   * @param membershipThresholdString
   * @author Dinh Minh Hoang
   */
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

  /**
   * Function to create a new User in the world state.
   * Delegates to UserContract
   * @param ctx
   * @param id
   * @param name
   * @author Dinh Minh Hoang
   */
  @Transaction()
  public async CreateUser(ctx: Context, id: string, name: string) {
    await this.userContract.CreateUser(ctx, id, name)
  }

  /**
   * Function to update already created RealEstate in the world state.
   * Delegates to RealEstateContract
   * @param ctx
   * @param id
   * @param name
   * @param roomListString
   * @param areaString
   * @param location
   * @param ownersString
   * @param membershipThresholdString
   * @author Dinh Minh Hoang
   */
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

  /**
   * Function to update already created User in the world state.
   * Delegates to UserContract
   * @param ctx
   * @param id
   * @param name
   * @param membershipScoreString
   * @author Dinh Minh Hoang
   */
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
   * Delegates to AssetContractOther.
   * @param {Context} ctx the transaction context
   * @param {string} AssetID the id of the asset (unique identifier)
   *  @returns {Promise<string>} the json object of the asset (stored in string format)
   * @author Dinh Minh Hoang
   */
  @Transaction(false)
  @Returns('string')
  public async ReadAsset(ctx: Context, AssetID: string): Promise<string> {
    return await this.assetContractOther.ReadAsset(ctx, AssetID)
  }

  /**
   * DeleteAsset deletes an given asset from the world state.
   * Delegates to AssetContractOther.
   * @param ctx
   * @param AssetID
   * @author Dinh Minh Hoang
   */
  @Transaction()
  public async DeleteAsset(ctx: Context, AssetID: string): Promise<void> {
    await this.assetContractOther.DeleteAsset(ctx, AssetID)
  }

  /**
   * AssetExists returns true when asset with given ID exists in world state.
   * Delegates to AssetContractOther.
   * @param ctx
   * @param id
   * @author Dinh Minh Hoang
   *  */
  @Transaction(false)
  @Returns('boolean')
  public async AssetExists(ctx: Context, id: string): Promise<boolean> {
    return this.assetContractOther.AssetExists(ctx, id)
  }

  /**
   * Function to check if the Transfer of RealEstate will be successful or not.
   * Must be run before TrasferRealEstate() function.
   * Delegates to RealEstateContract.
   * @param ctx
   * @param realEstateID
   * @param sellerID
   * @param buyerID
   * @param buyPercentageString
   * @author Dinh Minh Hoang
   */
  @Transaction(false)
  @Returns('boolean')
  public async CanTransferRealEstate(
    ctx: Context,
    realEstateID: string,
    sellerID: string,
    buyerID: string,
    buyPercentageString: string
  ) {
    return await this.realEstateContract.CanTransferRealEstate(
      ctx,
      realEstateID,
      sellerID,
      buyerID,
      buyPercentageString
    )
  }

  /**
   * Function to Transfer a RealEstate.
   * Delegates to RealEstateContract.
   * @param ctx
   * @param AssetID
   * @param sellerID
   * @param buyerID
   * @param buyPercentageString
   * @author Dinh Minh Hoang
   */
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

  /**
   * GetAllAssets returns all assets found in the world state.
   * Delegates to AssetContractOther.
   * @param ctx
   * @author Dinh Minh Hoang
   */
  @Transaction(false)
  @Returns('string')
  public async GetAllAssets(ctx: Context): Promise<string> {
    return await this.assetContractOther.GetAllAssets(ctx)
  }

  /**
   * GetAllRealEstate returns all RealEstate found in the world state.
   * Delegates to RealEstateContract.
   * @param ctx
   * @author Dinh Minh Hoang
   */
  @Transaction(false)
  @Returns('string')
  public async GetAllRealEstate(ctx: Context): Promise<string> {
    return await this.realEstateContract.GetAllRealEstate(ctx)
  }

  /**
   * GetUserRealEstate returns all Real Estate owned by User (user identified by userID)
   * Delegates to RealEstateContract.
   * @param ctx
   * @param userID
   * @author Dinh Minh Hoang
   */
  @Transaction(false)
  public async GetUserRealEstate(
    ctx: Context,
    userID: string
  ): Promise<string> {
    return await this.realEstateContract.GetUserRealEstate(ctx, userID)
  }
}
