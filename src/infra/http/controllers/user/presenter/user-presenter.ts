import type { User } from '@/domain/enterprise/user'

export class UsersPresenter {
  static toHttp(user: User) {
    return {
      id: user.id.toString(),
      name: user.name,
      birthdate: user.birthdate,
      phone: user.phone,
      email: user.email,
      photoPath: user.photoPath,
      role: user.role,
    }
  }
}
