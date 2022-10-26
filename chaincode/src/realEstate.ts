import { Object, Property } from 'fabric-contract-api'
import { RoomType } from './resources/classRoomType'
import { Ownership } from './resources/classOwnership'

@Object()
export class RealEstate {
  @Property()
  public docType: string

  @Property()
  public id: string

  @Property()
  public name: string

  @Property()
  public roomList: RoomType

  @Property()
  public area: number

  @Property()
  public location: string

  @Property()
  public owners: Ownership[]

  @Property()
  public membershipThreshold: number
}
