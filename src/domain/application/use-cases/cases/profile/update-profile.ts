import type { HashGenerator } from '@/core/cryptography/hash-generator'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { UsersRepository } from "@/domain/application/repositories/users-repository'"
import { User } from '@/domain/enterprise/user'

import { UserAlreadyExistsError } from '../../errors/user/user-already-exists'

interface UpdateProfileUseCaseRequest {
  userId: string
  name: string
  email: string
  password: string
  imageOriginalName: string
  imageFakeName: string
  imageType: string
  phone: string
  birthdate: Date
}

type UpdateProfileUseCaseResponse = Either<
  UserAlreadyExistsError,
  { user: User }
>

export class UpdateProfileUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    userId,
    name,
    password,
    email,
    imageOriginalName,
    imageFakeName,
    imageType,
    phone,
    birthdate,
  }: UpdateProfileUseCaseRequest): Promise<UpdateProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const userWithSameEmail =
      await this.usersRepository.findByEmailAndExcludeId(email, userId)

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError())
    }

    user.name = name
    user.email = email
    if (password !== undefined && password !== null && password !== '') {
      const passwordHash = await this.hashGenerator.hash(password)
      user.passwordHash = passwordHash
    }

    if (
      imageFakeName !== undefined &&
      imageFakeName !== null &&
      imageFakeName !== ''
    ) {
      user.imageFakeName = imageFakeName
      user.imageOriginalName = imageOriginalName
      user.imageType = imageType
    }
    user.phone = phone
    user.birthdate = birthdate
    await this.usersRepository.update(user)

    return right({ user })
  }
}
