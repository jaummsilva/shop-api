import { OrderRegisterUseCase } from '@/domain/application/use-cases/cases/order/register'
import { PrismaCartsRepository } from '@/infra/database/prisma/repositories/cart/prisma-carts-repository'
import { PrismaOrdersRepository } from '@/infra/database/prisma/repositories/order/prisma-orders-repository'
import { PrismaProductsRepository } from '@/infra/database/prisma/repositories/product/prisma-products-repository'

export function makeOrdersRegisterUseCase() {
  const ordersRepository = new PrismaOrdersRepository()
  const cartsRepository = new PrismaCartsRepository()
  const productsRepository = new PrismaProductsRepository()
  const ordersUseCase = new OrderRegisterUseCase(
    cartsRepository,
    ordersRepository,
    productsRepository,
  )

  return ordersUseCase
}
