/**
 * For each RealEstate, when a User owns a part (or all) of that RealEstate
 * that RealEstate will store an Ownership object containing data of that User.
 * @author Dinh Minh Hoang
 */

export class Ownership {
  ownerID: string
  ownershipPercentage: number
  sellPercentage: number
  sellPrice: number
  sellThreshold: number
  isSeller: boolean
}
