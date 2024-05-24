import { UserDeleteUseCase } from '@/domain/application/use-cases/cases/user/delete'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/user/prisma-users-repository'

export function makeUserDeleteUseCase() {
  const userRepository = new PrismaUsersRepository()
  const userDeleteUsersCase = new UserDeleteUseCase(userRepository)

  return userDeleteUsersCase
}
