import { Object, Property } from 'fabric-contract-api'
@Object()
export class User {
  @Property()
  public docType?: string

  @Property()
  public id: string

  @Property()
  public balance: number

  @Property()
  public membershipScore = 0
}
