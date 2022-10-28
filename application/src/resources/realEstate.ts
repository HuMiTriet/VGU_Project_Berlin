import { Ownership } from './ownership'
import { RoomType } from './roomType'

export interface RealEstate {
  id: string
  name: string
  roomList: RoomType
  area: number
  location: string
  owners: Ownership[]
  membershipThreshold: number
}
