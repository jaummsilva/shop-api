import { ProductUpdateUseCase } from '@/domain/application/use-cases/cases/product/update'
import { PrismaProductsRepository } from '@/infra/database/prisma/repositories/product/prisma-products-repository'

export function makeProductUpdateUseCase() {
  const productRepository = new PrismaProductsRepository()
  const UpdateProductCase = new ProductUpdateUseCase(productRepository)

  return UpdateProductCase
}
