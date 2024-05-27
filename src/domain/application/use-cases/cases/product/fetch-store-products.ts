import { type Either, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { ProductsRepository } from '@/domain/application/repositories/products-repository'
import type { Product } from '@/domain/enterprise/product'

interface FetchStoreProductsUseCaseRequest {
  query?: string
}

type FetchStoreProductsUseCaseResponse = Either<
  ResourceNotFoundError,
  { products: Product[] }
>

export class FetchStoreProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    query = '',
  }: FetchStoreProductsUseCaseRequest): Promise<FetchStoreProductsUseCaseResponse> {
    const { products } = await this.productsRepository.findStoreMany(query)

    return right({ products })
  }
}
