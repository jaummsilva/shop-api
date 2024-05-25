import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { ProductsRepository } from '@/domain/application/repositories/products-repository'

interface ProductDeleteUseCaseRequest {
  productId: string
}

type ProductDeleteUseCaseResponse = Either<
  ResourceNotFoundError,
  { response: boolean }
>

export class ProductDeleteUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productId,
  }: ProductDeleteUseCaseRequest): Promise<ProductDeleteUseCaseResponse> {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      return left(new ResourceNotFoundError())
    }

    await this.productsRepository.deleteProductImagesWhereOptional(productId)
    await this.productsRepository.deleteProductImagesWherePrincipal(productId)
    const response = await this.productsRepository.delete(productId)

    return right({ response })
  }
}
