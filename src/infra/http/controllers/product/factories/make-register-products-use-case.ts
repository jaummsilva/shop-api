import { ProductRegisterUseCase } from '@/domain/application/use-cases/cases/product/register'
import { PrismaProductsRepository } from '@/infra/database/prisma/repositories/product/prisma-products-repository'

export function makeProductRegisterUseCase() {
  const productRepository = new PrismaProductsRepository()
  const registerProductCase = new ProductRegisterUseCase(productRepository)

  return registerProductCase
}
