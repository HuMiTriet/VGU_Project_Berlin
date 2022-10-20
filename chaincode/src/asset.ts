/*
  SPDX-License-Identifier: Apache-2.0
*/

import { Ownership } from './IOwnership'

import { RoomType } from './classRoomType'

import { User } from './IUser'

import { Object, Property } from 'fabric-contract-api'

// @Object()
// export class TrueAsset {
//   @Property()
//   public docType?: string
// }

@Object()
export class RealEstate {
  @Property()
  public docType?: string

  @Property()
  public assetID: string

  @Property()
  public roomList: RoomType

  @Property()
  public area: number

  @Property()
  public location: string

  @Property()
  public owners: Ownership[]
}

@Object()
export class UserInfo {
  @Property()
  public docType?: string

  @Property()
  public user: User
}
