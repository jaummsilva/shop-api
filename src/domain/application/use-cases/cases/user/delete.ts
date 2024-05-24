import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { UsersRepository } from "@/domain/application/repositories/users-repository'"

import { UserAlreadyExistsError } from '../../errors/user/user-already-exists'

interface UserDeleteUseCaseRequest {
  userId: string
}

type UserDeleteUseCaseResponse = Either<
  UserAlreadyExistsError,
  { response: true | null }
>

export class UserDeleteUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: UserDeleteUseCaseRequest): Promise<UserDeleteUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const response = await this.usersRepository.delete(userId)

    return right({ response })
  }
}
