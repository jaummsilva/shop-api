import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { UsersRepository } from "@/domain/application/repositories/users-repository'"
import { User } from '@/domain/enterprise/user'

import { UserAlreadyExistsError } from '../../errors/user/user-already-exists'

interface UserUpdateStatusUseCaseRequest {
  userId: string
  status: 'S' | 'N'
}

type UserUpdateStatusUseCaseResponse = Either<
  UserAlreadyExistsError,
  { user: User }
>

export class UserUpdateStatusUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    status,
  }: UserUpdateStatusUseCaseRequest): Promise<UserUpdateStatusUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    user.status = status
    await this.usersRepository.update(user)

    return right({ user })
  }
}
