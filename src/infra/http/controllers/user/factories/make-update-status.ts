import { UserUpdateStatusUseCase } from '@/domain/application/use-cases/cases/user/update-status-user'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/user/prisma-users-repository'

export function makeUdateStatusUseCase() {
  const userRepository = new PrismaUsersRepository()
  const userUdateUsersCase = new UserUpdateStatusUseCase(userRepository)

  return userUdateUsersCase
}
