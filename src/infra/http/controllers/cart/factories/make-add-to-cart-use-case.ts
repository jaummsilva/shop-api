import { AddToCartUseCase } from '@/domain/application/use-cases/cases/cart/add-to-cart'
import { PrismaCartsRepository } from '@/infra/database/prisma/repositories/cart/prisma-carts-repository'
import { PrismaProductsRepository } from '@/infra/database/prisma/repositories/product/prisma-products-repository'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/user/prisma-users-repository'

export function makeAddToCartUseCase() {
  const productRepository = new PrismaProductsRepository()
  const cartsRepository = new PrismaCartsRepository()
  const usersRepository = new PrismaUsersRepository()
  const AddToCartCase = new AddToCartUseCase(
    cartsRepository,
    productRepository,
    usersRepository,
  )

  return AddToCartCase
}
