import { User } from './user'

export class MembershipHandler {
  public getMembershipTier(user: User): string {
    switch (true) {
      case user.membershipScore <= 300:
        return 'Platinum'

      case user.membershipScore <= 200:
        return 'Gold'

      case user.membershipScore <= 100:
        return 'Silver'

      case user.membershipScore <= 0:
        return 'Bronze'

      default:
        break
    }
  }
}
