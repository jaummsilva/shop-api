import { Either, right } from '@/core/either'
import type { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { ProductsRepository } from '@/domain/application/repositories/products-repository'
import { Product } from '@/domain/enterprise/product'
import { ProductImages } from '@/domain/enterprise/product-image'

interface ProductRegisterUseCaseRequest {
  name: string
  description?: string
  price: number
  createdAt?: Date
  updatedAt?: Date
  productImages: ProductImages[]
}

type ProductRegisterUseCaseResponse = Either<
  ResourceNotFoundError,
  { product: Product }
>

export class ProductRegisterUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    name,
    description,
    price,
    createdAt,
    updatedAt,
    productImages,
  }: ProductRegisterUseCaseRequest): Promise<ProductRegisterUseCaseResponse> {
    // Create the Product entity
    const product = Product.create({
      name,
      description,
      price,
      createdAt,
      updatedAt,
    })

    const productCreated = await this.productsRepository.create(product)

    const productImagesEntities = productImages.map((img) =>
      ProductImages.create({
        productId: productCreated.id.toString(),
        imageOriginalName: img.imageOriginalName,
        imageFakeName: img.imageFakeName,
        imageType: img.imageType,
        isPrincipal: img.isPrincipal,
      }),
    )

    await Promise.all(
      productImagesEntities.map((img) =>
        this.productsRepository.createProductImage(img),
      ),
    )

    return right({ product })
  }
}
