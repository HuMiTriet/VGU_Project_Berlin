import { Context, Contract, Info, Transaction } from 'fabric-contract-api'
import stringify from 'json-stringify-deterministic'
import sortKeysRecursive from 'sort-keys-recursive'
import { User } from './user'

import { userDocType } from './docType'

import { AssetContractOther } from './assetContractOther'

@Info({
  title: 'AssetTransfer',
  description: 'Smart contract for User'
})
export class UserContract extends Contract {
  private assetContractOther: AssetContractOther =
    new AssetContractOther()

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
  public async CreateUser(ctx: Context, id: string, name: string) {
    const exists = await this.assetContractOther.AssetExists(ctx, id)
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

  @Transaction()
  public async UpdateUser(
    ctx: Context,
    id: string,
    name: string,
    membershipScoreString: string
  ): Promise<void> {
    const exists = await this.assetContractOther.AssetExists(ctx, id)
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
}
