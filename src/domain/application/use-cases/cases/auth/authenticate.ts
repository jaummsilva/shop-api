import type { HashComparer } from '@/core/cryptography/hash-comparer'
import { type Either, left, right } from '@/core/either'
import type { UsersRepository } from '@/domain/application/repositories/users-repository'
import type { User } from '@/domain/enterprise/user'

import { UserNotExistsError } from '../../errors/user/user-not-exists'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUseCaseResponse = Either<UserNotExistsError, { user: User }>

export class AuthenticateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashCompare: HashComparer,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      return left(new UserNotExistsError())
    }

    const doesPasswordMatches = await this.hashCompare.compare(
      password,
      user.password_hash,
    )

    if (!doesPasswordMatches) {
      return left(new UserNotExistsError())
    }

    return right({ user })
  }
}
