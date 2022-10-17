export interface Ownership {
  ownerID: string
  ownershipPercentage: number
  // TODO: Floating point with Precision 2
  sellPercentage: number
  sellPrice: number

  // The smallest remaining percentage that seller can sale, Floating point with Precision 2
  sellThreshold: number
  isSeller: boolean
}
