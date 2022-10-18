/*
  SPDX-License-Identifier: Apache-2.0
*/

import { Ownership } from './IOwnership'

import { RoomType } from './classRoomType'

import { User } from './IUser'

import { Object, Property } from 'fabric-contract-api'

@Object()
export class Asset {
  @Property()
  public docType?: string

  @Property()
  public AssetID: string

  @Property()
  public roomList: RoomType

  @Property()
  public area: number

  @Property()
  public location: string

  @Property()
  public Owners: Ownership[]
}
@Object()
export class AssetUser {
  @Property()
  public docType?: string

  @Property()
  public user: User
}
