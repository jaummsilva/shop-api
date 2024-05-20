import { UserRegisterUseCase } from '@/domain/application/use-cases/cases/user/register'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-hasher'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/user/prisma-users-repository'

export function makeRegisterUseCase() {
  const userRepository = new PrismaUsersRepository()
  const bcriptyAdapater = new BcryptAdapter()
  const userRegisterUsersCase = new UserRegisterUseCase(
    userRepository,
    bcriptyAdapater,
  )

  return userRegisterUsersCase
}
