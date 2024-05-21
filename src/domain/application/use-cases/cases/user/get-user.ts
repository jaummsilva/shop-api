import { type Either, left, right } from '@/core/either'
import type { UsersRepository } from "@/domain/application/repositories/users-repository'"
import { User } from '@/domain/enterprise/user'

import { UserNotExistsError } from '../../errors/user/user-not-exists'

interface GetUserUseCaseRequest {
  userId: string
}

type GetUserUseCaseResponse = Either<UserNotExistsError, { user: User }>

export class GetUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserUseCaseRequest): Promise<GetUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new UserNotExistsError())
    }

    const userCreated = User.create(user)

    return right({ user: userCreated })
  }
}
