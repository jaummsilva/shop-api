import { AuthenticateUseCase } from '@/domain/application/use-cases/cases/auth/authenticate'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-hasher'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/user/prisma-users-repository'

export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const bcryptAdapater = new BcryptAdapter()
  const authenticateUsersCase = new AuthenticateUseCase(
    usersRepository,
    bcryptAdapater,
  )

  return authenticateUsersCase
}
