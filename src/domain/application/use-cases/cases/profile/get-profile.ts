import { type Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { UsersRepository } from "@/domain/application/repositories/users-repository'"
import type { User } from '@/domain/enterprise/user'

interface GetProfileUseCaseRequest {
  userId: string
}

type GetProfileUseCaseResponse = Either<ResourceNotFoundError, { user: User }>

export class GetProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    return right({ user })
  }
}
