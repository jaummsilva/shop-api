import { ClearProductFromCartCase } from '@/domain/application/use-cases/cases/cart/clear-product-from-cart'
import { PrismaCartsRepository } from '@/infra/database/prisma/repositories/cart/prisma-carts-repository'

export function makeClearProductFromCartUseCase() {
  const cartsRepository = new PrismaCartsRepository()
  const clearProductFromCartCase = new ClearProductFromCartCase(cartsRepository)

  return clearProductFromCartCase
}
