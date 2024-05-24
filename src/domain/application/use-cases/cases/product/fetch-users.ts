import { type Either, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { ProductsRepository } from '@/domain/application/repositories/products-repository'
import type { MetaResponse } from '@/domain/application/utils/meta-response'
import type { Product } from '@/domain/enterprise/product'

interface FetchProductsUseCaseRequest {
  name?: string
  page?: number
  perPage?: number
}

type FetchProductsUseCaseResponse = Either<
  ResourceNotFoundError,
  { products: Product[]; meta: MetaResponse }
>

export class FetchProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    name,
    page,
    perPage,
  }: FetchProductsUseCaseRequest): Promise<FetchProductsUseCaseResponse> {
    const { meta, products } = await this.productsRepository.findMany({
      page,
      name,
      perPage,
    })

    return right({ products, meta })
  }
}
