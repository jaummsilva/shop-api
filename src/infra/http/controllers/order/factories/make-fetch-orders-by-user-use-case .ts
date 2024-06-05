import { FetchOrdersByUserUseCase } from '@/domain/application/use-cases/cases/order/fetch-orders-by-user'
import { PrismaOrdersRepository } from '@/infra/database/prisma/repositories/order/prisma-orders-repository'

export function makeFetchOrdersByUserUseCase() {
  const ordersRepository = new PrismaOrdersRepository()
  const ordersUseCase = new FetchOrdersByUserUseCase(ordersRepository)

  return ordersUseCase
}
