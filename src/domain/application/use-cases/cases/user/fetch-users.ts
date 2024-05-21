import { type Either, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { UsersRepository } from "@/domain/application/repositories/users-repository'"
import type { MetaResponse } from '@/domain/application/utils/meta-response'
import type { User } from '@/domain/enterprise/user'

interface FetchUsersUseCaseRequest {
  name?: string
  page?: number
  perPage?: number
}

type FetchUsersUseCaseResponse = Either<
  ResourceNotFoundError,
  { users: User[]; meta: MetaResponse }
>

export class FetchUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    page,
    perPage,
  }: FetchUsersUseCaseRequest): Promise<FetchUsersUseCaseResponse> {
    const result = await this.usersRepository.findMany({ page, name, perPage })

    const users = result.users
    const meta = result.meta

    return right({ users, meta })
  }
}
