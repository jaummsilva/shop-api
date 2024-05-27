import { FetchProductsUseCase } from '@/domain/application/use-cases/cases/product/fetch-produts'
import { PrismaProductsRepository } from '@/infra/database/prisma/repositories/product/prisma-products-repository'

export function makeFetchProductsUseCase() {
  const productRepository = new PrismaProductsRepository()
  const fetchProductsCase = new FetchProductsUseCase(productRepository)

  return fetchProductsCase
}
