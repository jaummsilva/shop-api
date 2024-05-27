import { type Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { ProductsRepository } from '@/domain/application/repositories/products-repository'
import { Product } from '@/domain/enterprise/product'

interface GetProductUseCaseRequest {
  productId: string
}

type GetProductUseCaseResponse = Either<
  ResourceNotFoundError,
  { product: Product }
>

export class GetProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productId,
  }: GetProductUseCaseRequest): Promise<GetProductUseCaseResponse> {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      return left(new ResourceNotFoundError())
    }

    return right({ product })
  }
}
