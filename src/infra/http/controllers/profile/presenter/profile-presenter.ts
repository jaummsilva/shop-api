import type { User } from '@/domain/enterprise/user'

export class ProfilePresenter {
  static toHttp(user: User): {
    name: string
    email: string
    role: 'ADMIN' | 'MEMBER'
    phone: string
    birthdate: Date
    imageUrl: string
  } {
    return {
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      birthdate: user.birthdate,
      imageUrl: `/user/${user.id.toString()}/get-image/` + user.imageFakeName,
    }
  }
}
