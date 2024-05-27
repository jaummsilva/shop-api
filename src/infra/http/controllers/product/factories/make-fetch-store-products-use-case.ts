import { FetchStoreProductsUseCase } from '@/domain/application/use-cases/cases/product/fetch-store-products'
import { PrismaProductsRepository } from '@/infra/database/prisma/repositories/product/prisma-products-repository'

export function makeFetchStoreProductsUseCase() {
  const productRepository = new PrismaProductsRepository()
  const fetchStoreProductsCase = new FetchStoreProductsUseCase(
    productRepository,
  )

  return fetchStoreProductsCase
}
