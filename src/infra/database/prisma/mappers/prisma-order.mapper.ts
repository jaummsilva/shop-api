import type {
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order as DomainOrder } from '@/domain/enterprise/order'
import { OrderItem as DomainOrderItems } from '@/domain/enterprise/order-item'

export class PrismaOrderMapper {
  static toDomain(
    raw: PrismaOrder & {
      orderItems: PrismaOrderItem[]
    },
  ): DomainOrder {
    return DomainOrder.create(
      {
        userId: raw.userId ? new UniqueEntityID(raw.userId) : undefined,
        totalPrice: raw.totalPrice ?? 0,
        createdAt: raw.createdAt ?? new Date(),
        userName: raw.userName ? raw.userName : undefined,
        orderItems: raw.orderItems.map((orderItem) =>
          DomainOrderItems.create(
            {
              orderId: new UniqueEntityID(orderItem.orderId),
              productPrice: orderItem.productPrice,
              totalPrice: orderItem.totalPrice,
              productId: orderItem.productId
                ? new UniqueEntityID(orderItem.productId)
                : undefined,
              quantity: orderItem.quantity,
              productName: orderItem.productName,
            },
            new UniqueEntityID(raw.id),
          ),
        ),
      },
      new UniqueEntityID(raw.id),
    )
  }
}
