import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { ProductsRepository } from '@/domain/application/repositories/products-repository'
import { Product } from '@/domain/enterprise/product'
import { ProductImages } from '@/domain/enterprise/product-image'

interface ProductUpdateUseCaseRequest {
  productId: string
  name: string
  description?: string
  price: number
  productImages?: ProductImages[]
}

type ProductUpdateUseCaseResponse = Either<
  ResourceNotFoundError,
  { product: Product }
>

export class ProductUpdateUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productId,
    name,
    description,
    price,
    productImages,
  }: ProductUpdateUseCaseRequest): Promise<ProductUpdateUseCaseResponse> {
    const productExists = await this.productsRepository.findById(productId)

    if (!productExists) {
      return left(new ResourceNotFoundError())
    }

    if (description) {
      productExists.description = description
    }

    productExists.name = name
    productExists.price = price

    const productUpdated = await this.productsRepository.update(productExists)

    if (productImages && productImages.length > 0) {
      const optionalImages = productImages.filter((img) => !img.isPrincipal)
      const principalImages = productImages.filter((img) => img.isPrincipal)

      if (optionalImages.length > 0) {
        await this.productsRepository.deleteProductImagesWhereOptional(
          productId,
        )

        const optionalImagesEntities = optionalImages.map((img) =>
          ProductImages.create({
            productId: productUpdated.id.toString(),
            imageOriginalName: img.imageOriginalName,
            imageFakeName: img.imageFakeName,
            imageType: img.imageType,
            isPrincipal: img.isPrincipal,
          }),
        )

        await Promise.all(
          optionalImagesEntities.map((img) =>
            this.productsRepository.createProductImage(img),
          ),
        )
      }

      if (principalImages.length > 0) {
        await this.productsRepository.deleteProductImagesWherePrincipal(
          productId,
        )

        const principalImageEntity = principalImages.map((img) =>
          ProductImages.create({
            productId: productUpdated.id.toString(),
            imageOriginalName: img.imageOriginalName,
            imageFakeName: img.imageFakeName,
            imageType: img.imageType,
            isPrincipal: img.isPrincipal,
          }),
        )

        await Promise.all(
          principalImageEntity.map((img) =>
            this.productsRepository.createProductImage(img),
          ),
        )
      }
    }

    return right({ product: productUpdated })
  }
}
