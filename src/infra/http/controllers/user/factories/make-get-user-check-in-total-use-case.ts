import { GetUserCheckInTotalUseCase } from '@/domain/application/use-cases/cases/user/get-user-check-in-total'
import { PrismaCheckInsRepository } from '@/infra/database/prisma/repositories/check-in/prisma-check-ins-repository'

export function makeGetUserCheckInTotalUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const getUserCheckInTotalCase = new GetUserCheckInTotalUseCase(
    checkInsRepository,
  )

  return getUserCheckInTotalCase
}
