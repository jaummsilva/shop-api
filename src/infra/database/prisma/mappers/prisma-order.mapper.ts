import type {
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
  ProductImages,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order as DomainOrder } from '@/domain/enterprise/order'
import { OrderItem as DomainOrderItem } from '@/domain/enterprise/order-item'
import { ProductImages as DomainProductImage } from '@/domain/enterprise/product-image'

export class PrismaOrderMapper {
  static toDomain(
    raw: PrismaOrder & {
      orderItems: (PrismaOrderItem & {
        product: {
          productImages: ProductImages[]
        } | null
      })[]
    },
  ): DomainOrder {
    return DomainOrder.create({
      userId: raw.userId ? new UniqueEntityID(raw.userId) : undefined,
      totalPrice: raw.totalPrice ?? 0,
      createdAt: raw.createdAt ?? new Date(),
      userName: raw.userName ?? undefined,
      orderItems: raw.orderItems.map((orderItem) =>
        DomainOrderItem.create({
          orderId: new UniqueEntityID(orderItem.orderId),
          productPrice: orderItem.productPrice,
          totalPrice: orderItem.totalPrice,
          productId: orderItem.productId
            ? new UniqueEntityID(orderItem.productId)
            : undefined,
          quantity: orderItem.quantity,
          productName: orderItem.productName,
          productImages: orderItem.product
            ? orderItem.product.productImages.map((productImage) =>
                DomainProductImage.create({
                  imageFakeName: productImage.imageFakeName,
                  imageOriginalName: productImage.imageOriginalName,
                  imageType: productImage.imageType,
                  isPrincipal: productImage.isPrincipal,
                  productId: productImage.id,
                }),
              )
            : [],
        }),
      ),
    })
  }
}
