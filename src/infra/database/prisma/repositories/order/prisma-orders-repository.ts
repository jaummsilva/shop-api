import type { OrdersRepository } from '@/domain/application/repositories/orders-repository'
import type { Order } from '@/domain/enterprise/order'
import { prisma } from '@/infra/database/prisma/prisma'

import { PrismaOrderMapper } from '../../mappers/prisma-order.mapper'

export class PrismaOrdersRepository implements OrdersRepository {
  async create(data: Order) {
    const order = await prisma.order.create({
      data: {
        id: data.id.toString(),
        totalPrice: data.totalPrice,
        userId: data.userId ? data.userId.toString() : null,
        createdAt: data.createdAt ?? new Date(),
        orderItems: {
          create: data.orderItems.map((orderItem) => ({
            id: orderItem.id.toString(),
            productId: orderItem.productId
              ? orderItem.productId.toString()
              : null,
            quantity: orderItem.quantity,
            productPrice: orderItem.productPrice,
            totalPrice: orderItem.totalPrice,
            productName: orderItem.productName,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    })
    return PrismaOrderMapper.toDomain(order)
  }
}
