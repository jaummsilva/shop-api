import type { User } from '@/domain/enterprise/user'

export class UsersPresenter {
  static toHttp(user: User) {
    return {
      id: user.id.toString(),
      name: user.name,
      birthdate: user.birthdate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      phone: user.phone,
      email: user.email,
      imageOriginalName: user.imageOriginalName,
      imageFakeName: user.imageFakeName,
      imageUrl: '/user/get-image/' + user.imageFakeName,
      role: user.role,
      status: user.status,
    }
  }
}
