import { GetProfileUseCase } from '@/domain/application/use-cases/cases/profile/get-profile'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/user/prisma-users-repository'

export function makeGetProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const getProfileCase = new GetProfileUseCase(usersRepository)

  return getProfileCase
}
