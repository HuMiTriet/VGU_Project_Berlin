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
import stringify from 'json-stringify-deterministic'
import sortKeysRecursive from 'sort-keys-recursive'
import { Asset, UserInfo } from './asset'

import { Ownership } from './IOwnership'
import { RoomType } from './classRoomType'
import { User } from './IUser'

@Info({
  title: 'AssetTransfer',
  description: 'Smart contract for trading assets'
})
export class AssetTransferContract extends Contract {
  @Transaction()
  public async InitLedger(ctx: Context): Promise<void> {
    await this.InitLedgerAsset(ctx)
    await this.InitLedgerOwner(ctx)
  } // end InitLedger

  @Transaction()
  public async InitLedgerAsset(ctx: Context): Promise<void> {
    const ownerships: Array<Ownership> = [
      {
        ownerID: 'user1',
        ownershipPercentage: 100,
        sellPercentage: 50,
        sellPrice: 1000,
        sellThreshold: 5,
        isSeller: true
      }
    ]
    //roomType1: RoomType
    const roomType1: RoomType = {
      numOfBedroom: 2,
      numOfBathroom: 2,
      numOfDiningroom: 1,
      numOfLivingroom: 1
    }

    const roomType2: RoomType = {
      numOfBedroom: 3,
      numOfBathroom: 3,
      numOfDiningroom: 2,
      numOfLivingroom: 2
    }

    const assets: Asset[] = [
      {
        AssetID: 'asset1',
        area: 200,
        location: 'Ben Cat',
        Owners: ownerships,
        roomList: roomType1
      },
      {
        AssetID: 'asset2',
        area: 500,
        location: 'Dong Nai',
        Owners: ownerships,
        roomList: roomType2
      }
    ]

    for (const asset of assets) {
      asset.docType = 'asset'
      console.log('DEBUG: ONE ASSET BEFORE ADDED')
      // example of how to write to world state deterministically
      // use convetion of alphabetic order
      // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
      // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
      await ctx.stub.putState(
        asset.AssetID,
        Buffer.from(stringify(sortKeysRecursive(asset)))
      )
      console.log('DEBUG: ONE ASSET ADDED')
      console.info(`Asset ${asset.AssetID} initialized`)
    }
  }

  @Transaction()
  public async InitLedgerOwner(ctx: Context): Promise<void> {
    const user1: User = {
      userID: 'user1',
      balance: 1000
    }
    const user2: User = {
      userID: 'user2',
      balance: 500
    }
    const user3: User = {
      userID: 'user3',
      balance: 3000
    }

    const assets: UserInfo[] = [
      {
        user: user1
      },
      {
        user: user2
      },
      {
        user: user3
      }
    ]

    for (const asset of assets) {
      asset.docType = 'assetUser'
      // example of how to write to world state deterministically
      // use convetion of alphabetic order
      // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
      // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
      await ctx.stub.putState(
        asset.user.userID,
        Buffer.from(stringify(sortKeysRecursive(asset)))
      )
      console.log('DEBUG: ONE ASSET-USER ADDED')
      console.info(`Asset ${asset.user.userID} initialized`)
    }
  }

  @Transaction()
  public async CreateAsset(
    ctx: Context,
    AssetID: string,
    area: number,
    location: string,
    roomList: RoomType,
    Owners: Array<Ownership>
  ) {
    const exists = await this.AssetExists(ctx, AssetID)
    if (exists) {
      throw new Error(`The asset ${AssetID} already exists`)
    }

    const asset = {
      AssetID: AssetID,
      roomList: roomList,
      area: area,
      location: location,
      Owners: Owners
    }
    await ctx.stub.putState(
      AssetID,
      Buffer.from(stringify(sortKeysRecursive(asset)))
    )
  }

  // ReadAsset returns the asset stored in the world state with given id.
  @Transaction(false)
  public async ReadAsset(ctx: Context, AssetID: string): Promise<string> {
    const assetJSON = await ctx.stub.getState(AssetID) // get the asset from chaincode state
    if (!assetJSON || assetJSON.length === 0) {
      throw new Error(`The asset ${AssetID} does not exist`)
    }
    return assetJSON.toString()
  }

  // UpdateAsset updates an existing asset in the world state with provided parameters.
  @Transaction()
  public async UpdateAsset(
    ctx: Context,
    AssetID: string,
    roomList: RoomType,
    area: number,
    location: string,
    Owners: Ownership[]
  ): Promise<void> {
    const exists = await this.AssetExists(ctx, AssetID)
    if (!exists) {
      throw new Error(`The asset ${AssetID} does not exist`)
    }

    // overwriting original asset with new asset
    const updatedAsset = {
      AssetID: AssetID,
      roomList: roomList,
      area: area,
      location: location,
      Owners: Owners
    }
    // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    return ctx.stub.putState(
      AssetID,
      Buffer.from(stringify(sortKeysRecursive(updatedAsset)))
    )
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
  public async AssetExists(ctx: Context, AssetID: string): Promise<boolean> {
    const assetJSON = await ctx.stub.getState(AssetID)
    return assetJSON && assetJSON.length > 0
  }

  // TransferAsset updates the owner field of asset with given id in the world state, and returns the old owner.
  // @Transaction()
  // public async TransferAsset(
  //   ctx: Context,
  //   AssetID: string,
  //   seller: User,
  //   buyer: User,
  //   buyPercentage: number
  // ): Promise<string> {
  //   const assetString = await this.ReadAsset(ctx, AssetID)
  //   const asset = JSON.parse(assetString)

  //   //Get the seller's Ownership data
  //   const sellerOwnership: Ownership = asset.Ownership.find(
  //     (obj: Ownership) => {
  //       return obj.ownerID === seller.userID
  //     }
  //   )

  //   if (sellerOwnership.isSeller === false) {
  //     console.info('Asset is not for sale according to Seller.')
  //     return
  //   }
  //   if (sellerOwnership.ownershipPercentage < sellerOwnership.sellThreshold) {
  //     console.info(
  //       "Seller's ownership percentage is smaller than seller's sell threshhold."
  //     )
  //     return
  //   }
  //   const payment = sellerOwnership.sellPrice * buyPercentage
  //   if (buyer.balance < payment) {
  //     console.info('Buyer does not have enough balance.')
  //     return
  //   }

  //   const buyerOwnership: Ownership = {
  //     ownerID: buyer.userID,
  //     ownershipPercentage:
  //       sellerOwnership.ownershipPercentage *
  //       sellerOwnership.sellPercentage *
  //       buyPercentage,
  //     sellPercentage: 0.0,
  //     sellPrice: 0,
  //     sellThreshold: 5,
  //     isSeller: false
  //   }

  //   sellerOwnership.ownershipPercentage =
  //     sellerOwnership.ownershipPercentage - buyerOwnership.ownershipPercentage

  //   buyer.balance = buyer.balance - payment
  //   seller.balance = seller.balance + payment

  //   //Remove seller from Asset's Ownership if they don't have any ownershipPercentage left
  //   if (sellerOwnership.ownershipPercentage === 0) {
  //     const removeIndex = asset.Ownership.findIndex(obj => {
  //       return obj.ownerID === seller.userID
  //     })

  //     if (removeIndex !== -1) {
  //       asset.Ownership.splice(removeIndex, 1)
  //     }
  //   }

  //   // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
  //   await ctx.stub.putState(
  //     AssetID,
  //     Buffer.from(stringify(sortKeysRecursive(asset)))
  //   )
  //   return buyer.userID
  // }

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
