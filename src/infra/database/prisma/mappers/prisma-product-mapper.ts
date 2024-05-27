import type { Product as PrismaProduct, ProductImages } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Product as DomainProduct } from '@/domain/enterprise/product'
import { ProductImages as DomainProductImages } from '@/domain/enterprise/product-image'

export class PrismaProductMapper {
  static toDomain(
    raw: PrismaProduct & { productImages: ProductImages[] },
  ): DomainProduct {
    return DomainProduct.create(
      {
        name: raw.name,
        description: raw.description !== null ? raw.description : undefined,
        price: Number(raw.price),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        productImages: raw.productImages.map((productImage) =>
          DomainProductImages.create(
            {
              imageFakeName: productImage.imageFakeName,
              imageOriginalName: productImage.imageFakeName,
              imageType: productImage.imageType,
              isPrincipal: productImage.isPrincipal,
              productId: productImage.id,
            },
            new UniqueEntityID(raw.id),
          ),
        ),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(product: DomainProduct): PrismaProduct {
    return {
      id: product.id.toString(),
      name: product.name,
      description: product.description ?? '',
      price: new Decimal(product.price),
      createdAt: product.createdAt ?? new Date(),
      updatedAt: product.updatedAt ?? new Date(),
    }
  }
}
