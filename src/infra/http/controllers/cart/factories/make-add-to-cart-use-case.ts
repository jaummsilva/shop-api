import { AddToCartUseCase } from '@/domain/application/use-cases/cases/cart/add-to-cart'
import { PrismaCartsRepository } from '@/infra/database/prisma/repositories/cart/prisma-carts-repository'
import { PrismaProductsRepository } from '@/infra/database/prisma/repositories/product/prisma-products-repository'

export function makeAddToCartUseCase() {
  const productRepository = new PrismaProductsRepository()
  const cartsRepository = new PrismaCartsRepository()
  const AddToCartCase = new AddToCartUseCase(cartsRepository, productRepository)

  return AddToCartCase
}
