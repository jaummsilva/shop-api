import { ClearItemsFromCartCase } from '@/domain/application/use-cases/cases/cart/clear-items-from-cart'
import { PrismaCartsRepository } from '@/infra/database/prisma/repositories/cart/prisma-carts-repository'

export function makeClearItemsFromCartUseCase() {
  const cartsRepository = new PrismaCartsRepository()
  const clearItemsFromCartCase = new ClearItemsFromCartCase(cartsRepository)

  return clearItemsFromCartCase
}
