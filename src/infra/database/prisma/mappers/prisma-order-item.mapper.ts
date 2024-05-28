import type { OrderItem as PrismaOrderItem } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderItem as DomainOrderItem } from '@/domain/enterprise/order-item'

export class PrismaOrderItemMapper {
  static toDomain(raw: PrismaOrderItem): DomainOrderItem {
    return DomainOrderItem.create(
      {
        orderId: new UniqueEntityID(raw.orderId),
        productPrice: raw.productPrice,
        totalPrice: raw.totalPrice,
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
