import type {
  OrderItem as PrismaOrderItem,
  ProductImages,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderItem as DomainOrderItem } from '@/domain/enterprise/order-item'
import { ProductImages as DomainProductImage } from '@/domain/enterprise/product-image'

export class PrismaOrderItemMapper {
  static toDomain(
    raw: PrismaOrderItem & {
      product: {
        productImages: ProductImages[]
      } | null
    },
  ): DomainOrderItem {
    return DomainOrderItem.create(
      {
        orderId: new UniqueEntityID(raw.orderId),
        productPrice: raw.productPrice,
        totalPrice: raw.totalPrice,
        productImages: raw.product
          ? raw.product.productImages.map((productImage) =>
              DomainProductImage.create({
                imageFakeName: productImage.imageFakeName,
                imageOriginalName: productImage.imageOriginalName,
                imageType: productImage.imageType,
                isPrincipal: productImage.isPrincipal,
                productId: productImage.id,
              }),
            )
          : [],
        productId: raw.productId
          ? new UniqueEntityID(raw.productId)
          : undefined,
        quantity: raw.quantity,
        productName: raw.productName,
      },
      new UniqueEntityID(raw.id),
    )
  }
}
