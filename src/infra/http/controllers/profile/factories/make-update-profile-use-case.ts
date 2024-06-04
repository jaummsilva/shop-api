import { UpdateProfileUseCase } from '@/domain/application/use-cases/cases/profile/update-profile'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-hasher'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/user/prisma-users-repository'

export function makeUpdateProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const bcriptyAdapater = new BcryptAdapter()
  const updateProfileCase = new UpdateProfileUseCase(
    usersRepository,
    bcriptyAdapater,
  )

  return updateProfileCase
}
