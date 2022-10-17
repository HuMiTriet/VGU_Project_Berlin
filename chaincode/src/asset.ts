/*
  SPDX-License-Identifier: Apache-2.0
*/

import { Ownership } from './IOwnership'

import { RoomType } from './classRoomType'

import { Object, Property } from 'fabric-contract-api'

@Object()
export class Asset {
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
