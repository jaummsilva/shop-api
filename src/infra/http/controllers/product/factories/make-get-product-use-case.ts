import { GetProductUseCase } from '@/domain/application/use-cases/cases/product/get-product'
import { PrismaProductsRepository } from '@/infra/database/prisma/repositories/product/prisma-products-repository'

export function makeGetProductUseCase() {
  const productRepository = new PrismaProductsRepository()
  const fetchProductsCase = new GetProductUseCase(productRepository)

  return fetchProductsCase
}
