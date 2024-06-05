import { FetchOrdersUseCase } from '@/domain/application/use-cases/cases/order/fetch-orders'
import { PrismaOrdersRepository } from '@/infra/database/prisma/repositories/order/prisma-orders-repository'

export function makeFetchOrdersUseCase() {
  const ordersRepository = new PrismaOrdersRepository()
  const ordersUseCase = new FetchOrdersUseCase(ordersRepository)

  return ordersUseCase
}
