import { UpdateProductQuantityInCartUseCase } from '@/domain/application/use-cases/cases/cart/update-product-quantity-in-cart'
import { PrismaCartsRepository } from '@/infra/database/prisma/repositories/cart/prisma-carts-repository'
import { PrismaProductsRepository } from '@/infra/database/prisma/repositories/product/prisma-products-repository'

export function makeUpdateProductQuantityInCartUseCase() {
  const productRepository = new PrismaProductsRepository()
  const cartsRepository = new PrismaCartsRepository()
  const updateProductQuantityInCartCase =
    new UpdateProductQuantityInCartUseCase(cartsRepository, productRepository)

  return updateProductQuantityInCartCase
}
