import {
  Context,
  Contract,
  Info,
  Returns,
  Transaction
} from 'fabric-contract-api'
import stringify from 'json-stringify-deterministic'
import sortKeysRecursive from 'sort-keys-recursive'
import { RealEstate } from './realEstate'

import { Ownership } from './resources/classOwnership'
import { RoomType } from './resources/classRoomType'
import { realEstateDocType, userDocType } from './docType'

import { AssetContractOther } from './assetContractOther'
import { User } from './user'

const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const BLUE = '\x1b[34m'
const MAGENTA = '\x1b[35m'
const CYAN = '\x1b[36m'
const RESET = '\x1b[0m'
/**
 * @author Nguyen Khoa
 */
function debug(color: string, msgString: string) {
  console.log(`${color}\n\t${msgString}${RESET}\n`)
}

@Info({
  title: 'RealEstateTransfer',
  description: 'Smart contract for Real Estate'
})
export class RealEstateContract extends Contract {
  private assetContractOther: AssetContractOther = new AssetContractOther()

  /**
   * InitLedgerRealEstate initializes data of Real Estate in the World State
   * @param ctx
   * @author Dinh Minh Hoang
   */
  @Transaction()
  public async InitLedgerRealEstate(ctx: Context): Promise<void> {
    const ownerships: Array<Ownership> = [
      {
        ownerID:
          'x509::/C=US/ST=North Carolina/O=Hyperledger/OU=client/CN=minter::/C=US/ST=North Carolina/L=Durham/O=org1.example.com/CN=ca.org1.example.com',
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
      await ctx.stub.putState(
        oneRealEstate.id,
        Buffer.from(stringify(sortKeysRecursive(oneRealEstate)))
      )
      console.info(`Asset ${oneRealEstate.id} initialized`)
    }
  }

  /**
   * CreateRealEstate creates a new Real Estate
   * @param ctx
   * @param id
   * @param name
   * @param roomListString
   * @param areaString
   * @param location
   * @param OwnersString
   * @param membershipThresholdString
   * @author Dinh Minh Hoang, Nguyen Khoa
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
    const exists = await this.assetContractOther.AssetExists(ctx, id)
    if (exists) {
      throw new Error(`The realEstate ${id} already exists`)
    }

    const roomList: RoomType = JSON.parse(roomListString)
    const area: number = parseFloat(areaString)
    const owners: Array<Ownership> = JSON.parse(OwnersString)
    const membershipThreshold: number = parseInt(membershipThresholdString)

    // input validation
    let ownershipOnAsset = 0
    owners.forEach(function (owner: Ownership) {
      if (owner.sellPercentage > owner.ownershipPercentage) {
        debug(
          RED,
          'sellPercentage must be less than or equal ownershipPercentage'
        )
        throw new RangeError(
          'sellPercentage must be less than or equal ownershipPercentage'
        )
        // return new RangeError('sellPercentage must be less than or equal ownershipPercentage')
      }
      if (owner.ownershipPercentage > 100 || owner.ownershipPercentage < 0) {
        debug(RED, 'ownershipPercentage must be between 0 and 100')
        throw new RangeError('ownershipPercentage must be between 0 and 100')
        // return new RangeError('ownershipPercentage must be between 0 and 100')
      } else {
        ownershipOnAsset = ownershipOnAsset + owner.ownershipPercentage
      }
    })
    if (ownershipOnAsset > 100) {
      debug(RED, 'ownershipPercentage of all user must be less than 100')
      throw new RangeError(
        'ownershipPercentage of all user must be less than 100'
      )
      // return new RangeError('ownershipPercentage of all user must be less than 100')
    }

    if (area <= 0) {
      debug(RED, 'area must be > 0')
      throw new RangeError('area must be greater than 0')
      // return new RangeError('area must be greater than 0')
    }

    for (const key in roomList) {
      if (roomList[key] < 0) {
        debug(RED, 'Number of room must be greater than 0')
        throw new RangeError('Number of room must be greater than 0')
        // return new RangeError('Number of room must be greater than 0')
      }
    }

    if (membershipThreshold < 0) {
      debug(RED, 'membershipThresholdString must be greater than 0')
      throw new RangeError('membershipThresholdString must be greater than 0')
      // return new RangeError('membershipThresholdString must be greater than 0')
    }

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

  /**
   * UpdateRealEstate updates an already existed Real Estate
   * @param ctx
   * @param id
   * @param name
   * @param roomListString
   * @param areaString
   * @param location
   * @param ownersString
   * @param membershipThresholdString
   * @returns
   * @author Dinh Minh Hoang, Nguyen Khoa
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
    const exists = await this.assetContractOther.AssetExists(ctx, id)
    if (!exists) {
      throw new Error(`The asset ${id} does not exist`)
    }

    // code to test this method
    // peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"UpdateAsset","Args":["asset1", "{ \"numOfBedroom\": \"0\", \"numOfLivingroom\": \"0\", \"numOfBathroom\": \"0\", \"numOfDiningroom\": \"0\" }", "420", "cumhole", "[ { \"ownerID\": \"user1\", \"ownershipPercentage\": 69, \"sellPercentage\": 10, \"sellPrice\": 69420, \"sellThreshold\": 69, \"isSeller\": true },{ \"ownerID\": \"user2\", \"ownershipPercentage\": 69, \"sellPercentage\": 10, \"sellPrice\": 69420, \"sellThreshold\": 69, \"isSeller\": true } ]" ]}'
    const roomList: RoomType = JSON.parse(roomListString)
    const area: number = parseFloat(areaString)
    const owners: Array<Ownership> = JSON.parse(ownersString)
    const membershipThreshold = parseInt(membershipThresholdString)

    // input validation
    let ownershipOnAsset = 0
    owners.forEach(function (owner: Ownership) {
      if (owner.sellPercentage > owner.ownershipPercentage) {
        debug(
          RED,
          'sellPercentage must be less than or equal ownershipPercentage'
        )
        throw new RangeError(
          'sellPercentage must be less than or equal ownershipPercentage'
        )
        // return new RangeError('sellPercentage must be less than or equal ownershipPercentage')
      }
      if (owner.ownershipPercentage > 100 || owner.ownershipPercentage < 0) {
        debug(RED, 'ownershipPercentage must be between 0 and 100')
        throw new RangeError('ownershipPercentage must be between 0 and 100')
        // return new RangeError('ownershipPercentage must be between 0 and 100')
      } else {
        ownershipOnAsset = ownershipOnAsset + owner.ownershipPercentage
      }
    })
    if (ownershipOnAsset > 100) {
      debug(RED, 'ownershipPercentage of all user must be less than 100')
      throw new RangeError(
        'ownershipPercentage of all user must be less than 100'
      )
      // return new RangeError('ownershipPercentage of all user must be less than 100')
    }

    if (area <= 0) {
      debug(RED, 'area must be > 0')
      throw new RangeError('area must be greater than 0')
      // return new RangeError('area must be greater than 0')
    }

    for (const key in roomList) {
      if (roomList[key] < 0) {
        debug(RED, 'Number of room must be greater than 0')
        throw new RangeError('Number of room must be greater than 0')
        // return new RangeError('Number of room must be greater than 0')
      }
    }

    if (membershipThreshold < 0) {
      debug(RED, 'membershipThresholdString must be greater than 0')
      throw new RangeError('membershipThresholdString must be greater than 0')
      // return new RangeError('membershipThresholdString must be greater than 0')
    }

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

  /**
   * canTransferRealEstate returns true if the transaction of A Real Estate will be successful.
   * This function must be run before TransferRealEstate
   * @param {Context} ctx The transaction context
   * @param {string} realEstateID The ID of the Real Estate that will be transacted
   * @param {string} sellerID The ID of the Seller
   * @param {string} buyerID The ID of the Buyer
   * @param {string} buyPercentageString The Percentage of the Real Estate that Buyer wants to buy
   * @returns {Promise<boolean>} successful message
   * @author Dinh Minh Hoang, Nguyen Khoa
   * */
  @Transaction(false)
  @Returns('boolean')
  public async CanTransferRealEstate(
    ctx: Context,
    realEstateID: string,
    sellerID: string,
    buyerID: string,
    buyPercentageString: string
  ) {
    debug(
      MAGENTA,
      '==================== CanTransferRealEstate ===================='
    )
    //Check if buyer exists
    const buyerInfoJSON = await this.assetContractOther.ReadAsset(ctx, buyerID)
    if (buyerInfoJSON === undefined) {
      throw new Error('Buyer does not exist')
    }
    // console.log('Buyer exists')
    debug(CYAN, 'Buyer exists')

    const buyer: User = JSON.parse(buyerInfoJSON)

    //Check if seller exists
    const sellerInfoJSON = await this.assetContractOther.ReadAsset(
      ctx,
      sellerID
    )
    if (sellerInfoJSON === undefined) {
      throw new Error('Seller does not exist')
    }
    // console.log('Seller exists')
    debug(CYAN, 'Seller exists')

    //const seller: User = JSON.parse(sellerInfoJSON)

    //Check if buyer has the same ID as seller
    if (sellerID === buyerID) {
      throw new Error('Buyer has the same ID as Seller')
    }
    // console.log('Buyer is not the same as Seller')
    debug(CYAN, 'Buyer is not the same as Seller')

    //convert buyPercentage to String
    const buyPercentage = parseFloat(buyPercentageString)
    // console.log('Buyer wants to buy ' + buyPercentage + '%')
    console.log(`Buyer wants to buy ${buyPercentage}%`)

    //Get Real Estate
    const realEstateString = await this.assetContractOther.ReadAsset(
      ctx,
      realEstateID
    )
    const realEstate: RealEstate = JSON.parse(realEstateString)
    // console.log('Real Estate exists, ID:' + realEstate.id)
    debug(CYAN, `Real Estate exists, ID: ${realEstate.id}`)

    if (realEstate.membershipThreshold > buyer.membershipScore) {
      throw new Error('Buyer does not have enough membership score')
    }

    //Get the seller's Ownership data
    const sellerOwnership: Ownership = realEstate.owners.find(
      (obj: Ownership) => {
        return obj.ownerID === sellerID
      }
    )

    if (sellerOwnership === undefined) {
      // throw new Error(
      //   'Seller with ID:' +
      //     sellerID +
      //     ' does not own asset with ID:' +
      //     realEstateID
      // )
      throw new Error(
        `Seller with ID: ${sellerID} does not own asset with ID: ${realEstateID}`
      )
    }
    debug(CYAN, 'Seller owns this asset')
    // console.log('Seller owns this asset')

    if (sellerOwnership.isSeller === false) {
      throw new Error('Asset is not for sale according to Seller.')
    }
    // console.log('Seller is selling this asset')
    debug(CYAN, 'Seller is selling this asset')

    //Check if buyer wants to buy MORE than seller's sellPercentage
    if (buyPercentage > sellerOwnership.sellPercentage) {
      throw new Error(
        "Buyer wants to buy more percentage than Seller's sell percentage"
      )
    }
    debug(
      CYAN,
      `buyPercentage (${buyPercentage}%) <= sellPercentage (${sellerOwnership.sellPercentage}%)`
    )

    const sellerRemainOwnershipPercentage =
      sellerOwnership.sellPercentage - buyPercentage
    debug(
      CYAN,
      `If transaction is successful, the remaining seller's ownershipPercentage will be: ${sellerRemainOwnershipPercentage}`
    )
    // console.log(
    //   `If transaction is successful, the remaining seller's ownershipPercentage will be: ${sellerRemainOwnershipPercentage}`
    // )

    if (
      sellerRemainOwnershipPercentage < sellerOwnership.sellThreshold &&
      sellerRemainOwnershipPercentage !== 0
    ) {
      throw new Error(
        "Seller's remaining ownership percentage is smaller than seller's sell threshhold." +
          ' AND the remaining ownership percentage is not 0'
      )
    }

    return true
  }

  /**
   * TransferRealEstate will transfer A Real Estate From a Seller to a Buyer.
   * Note that canTransferRealEstate must be run (and return true) before this function can be run correctly.
   * Seller's and Buyer's balance are NOT updated here, refer to token-erc-20 chaincode for transferring money/token.
   * @param {Context} ctx The transaction context
   * @param {string} realEstateID The ID of the Real Estate that will be transacted
   * @param {string} sellerID The ID of the Seller
   * @param {string} buyerID The ID of the Buyer
   * @param {string} buyPercentageString The Percentage of the Real Estate that Buyer wants to buy
   * @returns {Prosmise<string>} successful message
   * @author Dinh Minh Hoang, Huynh Minh Triet
   */
  @Transaction()
  public async TransferRealEstate(
    ctx: Context,
    AssetID: string,
    sellerID: string,
    buyerID: string,
    buyPercentageString: string
  ): Promise<string> {
    //Get real estate from ID
    const realEstateString = await this.assetContractOther.ReadAsset(
      ctx,
      AssetID
    )
    const realEstate: RealEstate = JSON.parse(realEstateString)

    //Get the seller's Ownership data
    const sellerOwnership: Ownership = realEstate.owners.find(
      (obj: Ownership) => {
        return obj.ownerID === sellerID
      }
    )

    //convert buyPercentage to String
    const buyPercentage = parseFloat(buyPercentageString)
    const payment = (sellerOwnership.sellPrice / 100) * buyPercentage

    console.log('Buyer pays ' + payment + ' to the Seller')

    //Get buyer
    const buyerInfoJSON = await this.assetContractOther.ReadAsset(ctx, buyerID)
    const buyer: User = JSON.parse(buyerInfoJSON)

    //Get Seller
    const sellerInfoJSON = await this.assetContractOther.ReadAsset(
      ctx,
      sellerID
    )
    const seller: User = JSON.parse(sellerInfoJSON)

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

    await ctx.stub.putState(
      AssetID,
      Buffer.from(stringify(sortKeysRecursive(realEstate)))
    )
    debug(GREEN, 'Successfully updates Real Estate')

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
    // console.log('Successfully updates participants in Transaction')
    debug(GREEN, 'Successfully updates participants in Transaction')

    // console.log(
    //   'current membershipScore of buyer: ' +
    //     buyer.id +
    //     'score: ' +
    //     buyer.membershipScore
    // )
    debug(
      BLUE,
      `Current membershipScore of buyer (ID: ${buyer.id}): ${buyer.membershipScore}`
    )
    // return (
    //   'Transaction successful. Buyer ' +
    //   buyerOwnership.ownerID +
    //   ' obtained ' +
    //   buyPercentage +
    //   '% of Asset ' +
    //   realEstate.id +
    //   ' from Seller ' +
    //   sellerOwnership.ownerID
    // )
    return `Transaction successful. Buyer (ID: ${buyerOwnership.ownerID}) obtained ${buyPercentage}% of Asset (ID: ${realEstate.id})  from Seller ${sellerOwnership.ownerID}`
  }

  /**
   * GetAllRealEstate returns all Real Estates found in the world state.
   * @param ctx
   * @returns {string} JSON format of Real Estates
   * @author Dinh Minh Hoang
   */
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

  @Transaction(false)
  public async GetUserRealEstate(
    ctx: Context,
    userID: string
  ): Promise<string> {
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
        for (const oneOwner of record.owners as Ownership[]) {
          if (oneOwner.ownerID === userID) {
            allResults.push(record)
            break
          }
        }
      }

      //allResults.push(record)
      result = await iterator.next()
    }
    return JSON.stringify(allResults)
  }
}
