import type { HashGenerator } from '@/core/cryptography/hash-generator'
import { type Either, left, right } from '@/core/either'
import type { UsersRepository } from "@/domain/application/repositories/users-repository'"
import { User } from '@/domain/enterprise/user'

import { UserAlreadyExistsError } from '../../errors/user/user-already-exists'

interface UserRegisterUseCaseRequest {
  name: string
  password: string
  email: string
  role: 'ADMIN' | 'MEMBER'
}

type UserRegisterUseCaseResponse = Either<
  UserAlreadyExistsError,
  { user: User }
>

export class UserRegisterUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    password,
    email,
    role,
  }: UserRegisterUseCaseRequest): Promise<UserRegisterUseCaseResponse> {
    const passwordHash = await this.hashGenerator.hash(password)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError())
    }

    const user = User.create({ name, email, password_hash: passwordHash, role })

    await this.usersRepository.create(user)

    return right({ user })
  }
}
