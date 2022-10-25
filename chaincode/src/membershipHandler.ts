import { User } from './user'

export class MembershipHandler {
  public getMembershipTier(user: User): string {
    switch (true) {
      case user.membershipScore <= 100:
        return 'Deluxe'

      case user.membershipScore <= 70:
        return 'Platinum'

      case user.membershipScore <= 25:
        return 'Gold'

      case user.membershipScore <= 5:
        return 'Silver'

      case user.membershipScore <= 0:
        return 'Bronze'

      default:
        break
    }
  }
}
