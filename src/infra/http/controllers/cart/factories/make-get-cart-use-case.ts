import { GetCartUseCase } from '@/domain/application/use-cases/cases/cart/get-cart'
import { PrismaCartsRepository } from '@/infra/database/prisma/repositories/cart/prisma-carts-repository'

export function makeGetCartUseCase() {
  const cartsRepository = new PrismaCartsRepository()
  const AddToCartCase = new GetCartUseCase(cartsRepository)

  return AddToCartCase
}
