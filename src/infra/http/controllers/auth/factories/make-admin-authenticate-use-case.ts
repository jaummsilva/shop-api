import { AdminAuthenticateUseCase } from '@/domain/application/use-cases/cases/auth/admin-authenticate'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-hasher'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/user/prisma-users-repository'

export function makeAdminAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const bcryptAdapater = new BcryptAdapter()
  const adminAuthenticateUsersCase = new AdminAuthenticateUseCase(
    usersRepository,
    bcryptAdapater,
  )

  return adminAuthenticateUsersCase
}
