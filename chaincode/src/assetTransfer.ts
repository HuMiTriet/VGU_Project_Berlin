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
import { User } from './user'
import { RealEstate } from './realEstate'
import { TokenERC20Contract } from './tokenERC20'

import { Ownership } from './resources/classOwnership'
import { RoomType } from './resources/classRoomType'
import { realEstateDocType, userDocType } from './docType'

@Info({
  title: 'AssetTransfer',
  description: 'Smart contract for trading assets'
})
export class AssetTransferContract extends Contract {
  @Transaction()
  public async InitLedger(ctx: Context): Promise<void> {
    await this.InitLedgerAsset(ctx)
    await this.InitLedgerUser(ctx)
    await TokenERC20Contract.Initialize(ctx, 'name', 'symbol', '2')
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

    const realEstate: RealEstate[] = [
      {
        name: 'Beautiful Duplex Apartment',
        docType: realEstateDocType,
        id: 'asset1',
        area: 200,
        location: 'Ben Cat',
        owners: ownerships,
        roomList: roomType1,
        membershipThreshold: 0
      },
      {
        name: 'Gorgeous Triplex Apartment',
        docType: realEstateDocType,
        id: 'asset2',
        area: 500,
        location: 'Dong Nai',
        owners: ownerships,
        roomList: roomType2,
        membershipThreshold: 5
      }
    ]

    for (const oneRealEstate of realEstate) {
      //oneRealEstate.docType = realEstateDocType
      console.log('DEBUG: ONE ASSET BEFORE ADDED')
      // example of how to write to world state deterministically
      // use convetion of alphabetic order
      // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
      // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
      await ctx.stub.putState(
        oneRealEstate.id,
        Buffer.from(stringify(sortKeysRecursive(oneRealEstate)))
      )
      console.log('DEBUG: ONE ASSET ADDED')
      console.info(`Asset ${oneRealEstate.id} initialized`)
    }
  }

  @Transaction()
  public async InitLedgerUser(ctx: Context): Promise<void> {
    const assets: User[] = [
      {
        name: 'Thinh Le',
        docType: userDocType,
        id: 'user1',
        membershipScore: 10
      },
      {
        name: 'John Doe',
        docType: userDocType,
        id: 'user2',
        membershipScore: 0
      },
      {
        name: 'James Washington',
        docType: userDocType,
        id: 'user3',
        membershipScore: 0
      }
    ]

    for (const asset of assets) {
      // asset.docType = userDocType
      // example of how to write to world state deterministically
      // use convetion of alphabetic order
      // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
      // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
      await ctx.stub.putState(
        asset.id,
        Buffer.from(stringify(sortKeysRecursive(asset)))
      )
      console.log('DEBUG: ONE ASSET-USER ADDED')
      console.info(`Asset ${asset.id} initialized`)
    }
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
    const exists = await this.AssetExists(ctx, id)
    if (exists) {
      throw new Error(`The realEstate ${id} already exists`)
    }

    const roomList: RoomType = JSON.parse(roomListString)

    const area: number = parseFloat(areaString)

    const owners: Array<Ownership> = JSON.parse(OwnersString)

    const membershipThreshold: number = parseInt(membershipThresholdString)

    const realEstate: RealEstate = {
      name: name,
      docType: realEstateDocType,
      id: id,
      roomList: roomList,
      area: area,
      location: location,
      owners: owners,
      membershipThreshold: membershipThreshold
    }

    await ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(realEstate)))
    )
  }

  @Transaction()
  public async CreateUser(ctx: Context, id: string, name: string) {
    const exists = await this.AssetExists(ctx, id)
    if (exists) {
      throw new Error(`The user ${id} already exists`)
    }

    const user: User = {
      name: name,
      membershipScore: 0,
      docType: userDocType,
      id: id
    }

    await ctx.stub.putState(
      user.id,
      Buffer.from(stringify(sortKeysRecursive(user)))
    )
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
    const assetJSON = await ctx.stub.getState(AssetID) // get the asset from chaincode state
    if (!assetJSON || assetJSON.length === 0) {
      throw new Error(`The asset ${AssetID} does not exist`)
    }
    return assetJSON.toString()
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
    const exists = await this.AssetExists(ctx, id)
    if (!exists) {
      throw new Error(`The asset ${id} does not exist`)
    }

    // code to test this method
    // peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"UpdateAsset","Args":["asset1", "{ \"numOfBedroom\": \"0\", \"numOfLivingroom\": \"0\", \"numOfBathroom\": \"0\", \"numOfDiningroom\": \"0\" }", "420", "cumhole", "[ { \"ownerID\": \"user1\", \"ownershipPercentage\": 69, \"sellPercentage\": 10, \"sellPrice\": 69420, \"sellThreshold\": 69, \"isSeller\": true },{ \"ownerID\": \"user2\", \"ownershipPercentage\": 69, \"sellPercentage\": 10, \"sellPrice\": 69420, \"sellThreshold\": 69, \"isSeller\": true } ]" ]}'

    const roomList: RoomType = JSON.parse(roomListString)

    const area: number = parseFloat(areaString)

    const owners: Array<Ownership> = JSON.parse(ownersString)

    const membershipThreshold = parseInt(membershipThresholdString)

    // overwriting original asset with new asset
    const updatedRealEstate: RealEstate = {
      name: name,
      docType: realEstateDocType,
      id: id,
      roomList: roomList,
      area: area,
      location: location,
      owners: owners,
      membershipThreshold: membershipThreshold
    }
    // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'

    return ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(updatedRealEstate)))
    )
  }

  @Transaction()
  public async UpdateUser(
    ctx: Context,
    id: string,
    name: string,
    membershipScoreString: string
  ): Promise<void> {
    const exists = await this.AssetExists(ctx, id)
    if (!exists) {
      throw new Error(`The user ${id} does not exist`)
    }

    const membershipScore = parseInt(membershipScoreString)

    // overwriting original asset with new asset
    const updatedUser: User = {
      name: name,
      docType: userDocType,
      id: id,
      membershipScore: membershipScore
    }
    // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    return ctx.stub.putState(
      updatedUser.id,
      Buffer.from(stringify(sortKeysRecursive(updatedUser)))
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
  public async AssetExists(ctx: Context, id: string): Promise<boolean> {
    const assetJSON = await ctx.stub.getState(id)
    return assetJSON && assetJSON.length > 0
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
    console.log('Starting transfer asset')
    console.log('Asset ID:' + AssetID)
    console.log('seller ID: ' + sellerID)
    console.log('buyer ID: ' + buyerID)
    console.log('Buy Percentage: ' + buyPercentageString)

    //Check if buyer exists
    const buyerInfoJSON = await this.ReadAsset(ctx, buyerID)
    if (buyerInfoJSON === undefined) {
      throw new Error('Buyer does not exist')
    }
    console.log('Buyer exists')

    const buyer: User = JSON.parse(buyerInfoJSON)

    console.log('Info of Buyer:')
    console.log("Buyer's ID:" + buyer.id)
    console.log("Buyer's membershipScore:" + buyer.membershipScore)

    //convert buyPercentage to String
    const buyPercentage = parseFloat(buyPercentageString)
    console.log('Buyer wants to buy ' + buyPercentage + '%')

    const assetString = await this.ReadAsset(ctx, AssetID)

    console.log('--> Object AssetString to parse: ' + assetString)

    const realEstate: RealEstate = JSON.parse(assetString)
    console.log('Asset exists, AssetID:' + realEstate.id)

    if (realEstate.membershipThreshold > buyer.membershipScore) {
      throw new Error('Buyer does not have enough membership score')
    }

    //Check if seller exists
    const sellerInfoJSON = await this.ReadAsset(ctx, sellerID)
    if (sellerInfoJSON === undefined) {
      throw new Error('Seller does not exist')
    }
    console.log('Seller exists')

    const seller: User = JSON.parse(sellerInfoJSON)

    console.log('Info of Seller:')
    console.log("Seller's ID: " + seller.id)

    //Check if buyer has the same ID as seller
    if (sellerID === buyerID) {
      throw new Error('Buyer has the same ID as Seller')
    }
    console.log('Buyer is not the same as Seller')

    //Get the seller's Ownership data
    const sellerOwnership: Ownership = realEstate.owners.find(
      (obj: Ownership) => {
        return obj.ownerID === sellerID
      }
    )

    if (sellerOwnership === undefined) {
      throw new Error(
        'Seller with ID:' + sellerID + ' does not own asset with ID:' + AssetID
      )
    }
    console.log('Seller owns this asset')

    if (sellerOwnership.isSeller === false) {
      throw new Error('Asset is not for sale according to Seller.')
    }
    console.log('Seller is selling this asset')

    const sellerRemainOwnershipPercentage =
      sellerOwnership.sellPercentage - buyPercentage

    console.log(
      "If transaction is successful, the remaining seller's ownershipPercentage will be: " +
        sellerRemainOwnershipPercentage
    )

    if (
      sellerRemainOwnershipPercentage < sellerOwnership.sellThreshold &&
      sellerRemainOwnershipPercentage !== 0
    ) {
      throw new Error(
        "Seller's remaining ownership percentage is smaller than seller's sell threshhold." +
          " OR buyer's does not buy all"
      )
    }

    //Check if buyer wants to buy MORE than seller's sellPercentage
    if (buyPercentage > sellerOwnership.sellPercentage) {
      throw new Error(
        "Buyer wants to buy more percentage than Seller's sell percentage"
      )
    }

    const payment = (sellerOwnership.sellPrice / 100) * buyPercentage

    console.log('Buyer payed ' + payment + ' to the seller')
    // if (buyer.balance < payment) {
    //   throw new Error('Buyer does not have enough balance.')
    // }

    //Check if buyer has already bought this asset once or more.
    let buyerOwnership: Ownership = realEstate.owners.find((obj: Ownership) => {
      return obj.ownerID === buyer.id
    })

    //If buyer isn't currently own this asset yet, create new Ownership for buyer
    if (buyerOwnership === undefined) {
      console.log(
        "Buyer isn't currently own this asset yet, create new Ownership for buyer"
      )
      buyerOwnership = {
        ownerID: buyer.id,
        ownershipPercentage: 0.0,
        sellPercentage: 0.0,
        sellPrice: 0,
        sellThreshold: 5,
        isSeller: false
      }

      //Add Buyer to Owners list of this asset
      realEstate.owners.push(buyerOwnership)
    } else {
      console.log(
        'Buyer already owned a part of this asset, skipping creating new Ownership for buyer.'
      )
    }

    console.log('Updating ownership percentage')
    buyerOwnership.ownershipPercentage += buyPercentage
    console.log(
      "Buyer's ownership percentage: " + buyerOwnership.ownershipPercentage
    )
    sellerOwnership.ownershipPercentage -= buyPercentage
    console.log(
      "Seller's ownership percentage: " + sellerOwnership.ownershipPercentage
    )
    // console.log('Updating balance')
    // buyer.balance -= payment
    // console.log("Buyer's balance: " + buyer.balance)
    // seller.balance += payment
    // console.log("Seller's balance: " + seller.balance)
    console.log('Updating sell percentage of seller.')
    sellerOwnership.sellPercentage -= buyPercentage
    console.log("Seller's sell percentage: " + sellerOwnership.sellPercentage)

    //Remove seller from Asset's Ownership if they don't have any ownershipPercentage left
    if (sellerOwnership.ownershipPercentage === 0) {
      const removeIndex = realEstate.owners.findIndex(obj => {
        return obj.ownerID === seller.id
      })

      if (removeIndex !== -1) {
        console.log('Removing seller from list of Ownership')
        realEstate.owners.splice(removeIndex, 1)
      }
    }

    // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    await ctx.stub.putState(
      AssetID,
      Buffer.from(stringify(sortKeysRecursive(realEstate)))
    )
    console.log('Successfully updates Asset')

    buyer.membershipScore += 1

    const participants: User[] = [
      {
        name: seller.name,
        docType: userDocType,
        id: seller.id,
        membershipScore: seller.membershipScore
      },
      {
        name: buyer.name,
        docType: userDocType,
        id: buyer.id,
        membershipScore: buyer.membershipScore
      }
    ]

    for (const participant of participants) {
      await ctx.stub.putState(
        participant.id,
        Buffer.from(stringify(sortKeysRecursive(participant)))
      )
    }
    console.log('Successfully updates participants in Transaction')

    console.log(
      'current membershipScore of buyer: ' +
        buyer.id +
        'score: ' +
        buyer.membershipScore
    )

    return (
      'Transaction successful. Buyer' +
      buyerOwnership.ownerID +
      ' obtained ' +
      buyPercentage +
      '% of Asset ' +
      realEstate.id +
      ' from Seller ' +
      sellerOwnership.ownerID
    )
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

  // GetAllAssets returns all assets found in the world state.
  @Transaction(false)
  @Returns('string')
  public async GetAllRealEstate(ctx: Context): Promise<string> {
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

      if (record.docType === realEstateDocType) {
        allResults.push(record)
      }

      //allResults.push(record)
      result = await iterator.next()
    }
    return JSON.stringify(allResults)
  }
}
