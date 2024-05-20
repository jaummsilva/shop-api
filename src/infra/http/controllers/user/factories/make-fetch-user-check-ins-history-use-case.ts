import { FetchUserCheckInsHistoryUseCase } from '@/domain/application/use-cases/cases/user/fetch-user-check-ins-history'
import { PrismaCheckInsRepository } from '@/infra/database/prisma/repositories/check-in/prisma-check-ins-repository'

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const fetchUserCheckInsHistoryUsersCase = new FetchUserCheckInsHistoryUseCase(
    checkInsRepository,
  )

  return fetchUserCheckInsHistoryUsersCase
}
