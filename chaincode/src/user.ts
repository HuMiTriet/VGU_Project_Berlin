import { Object, Property } from 'fabric-contract-api'
@Object()
export class User {
  @Property()
  public docType: string

  @Property()
  public id: string

  @Property()
  public name: string

  /**
   * @author Huynh Minh Triet <17447@student.vgu.edu.vn>
   */
  @Property()
  public membershipScore: number
}
