import { ProductDeleteUseCase } from '@/domain/application/use-cases/cases/product/delete'
import { PrismaProductsRepository } from '@/infra/database/prisma/repositories/product/prisma-products-repository'

export function makeDeleteProductUseCase() {
  const productRepository = new PrismaProductsRepository()
  const deleteProductsCase = new ProductDeleteUseCase(productRepository)

  return deleteProductsCase
}
