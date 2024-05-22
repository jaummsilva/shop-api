import { UserUpdateUseCase } from '@/domain/application/use-cases/cases/user/update'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-hasher'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/user/prisma-users-repository'

export function makeUdateUseCase() {
  const userRepository = new PrismaUsersRepository()
  const bcriptyAdapater = new BcryptAdapter()
  const userUdateUsersCase = new UserUpdateUseCase(
    userRepository,
    bcriptyAdapater,
  )

  return userUdateUsersCase
}
