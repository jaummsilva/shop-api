import { FetchUsersUseCase } from '@/domain/application/use-cases/cases/user/fetch-users'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/user/prisma-users-repository'

export function makeFetchUsersUseCase() {
  const userRepository = new PrismaUsersRepository()
  const fetchUsersCase = new FetchUsersUseCase(userRepository)

  return fetchUsersCase
}
