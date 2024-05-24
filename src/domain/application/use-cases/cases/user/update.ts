import type { HashGenerator } from '@/core/cryptography/hash-generator'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { UsersRepository } from "@/domain/application/repositories/users-repository'"
import { User } from '@/domain/enterprise/user'

import { UserAlreadyExistsError } from '../../errors/user/user-already-exists'

interface UserUpdateUseCaseRequest {
  userId: string
  name: string
  password: string
  email: string
  role: 'ADMIN' | 'MEMBER'
  phone: string
  birthdate: Date
  imageOriginalName: string
  imageFakeName: string
  imageType: string
  status: 'S' | 'N'
}

type UserUpdateUseCaseResponse = Either<UserAlreadyExistsError, { user: User }>

export class UserUpdateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    userId,
    name,
    password,
    email,
    role,
    phone,
    birthdate,
    imageOriginalName,
    imageFakeName,
    imageType,
    status,
  }: UserUpdateUseCaseRequest): Promise<UserUpdateUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const userWithSameEmail =
      await this.usersRepository.findByEmailAndExcludeId(email, userId)

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError())
    }

    user.birthdate = birthdate
    if (password !== undefined && password !== null && password !== '') {
      const passwordHash = await this.hashGenerator.hash(password)
      user.passwordHash = passwordHash
    }
    user.status = status
    user.email = email
    user.name = name
    user.phone = phone
    user.role = role
    if (
      imageFakeName !== undefined &&
      imageFakeName !== null &&
      imageFakeName !== ''
    ) {
      user.imageFakeName = imageFakeName
      user.imageOriginalName = imageOriginalName
      user.imageType = imageType
    }

    await this.usersRepository.update(user) // Assuming update method exists

    return right({ user })
  }
}
