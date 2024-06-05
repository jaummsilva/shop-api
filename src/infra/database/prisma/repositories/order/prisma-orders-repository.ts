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
        userName: data.userName ? data.userName : null,
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
        orderItems: {
          include: {
            product: {
              select: {
                productImages: true,
              },
            },
          },
        },
        user: true,
      },
    })

    return PrismaOrderMapper.toDomain(order)
  }

  async findManyByUser(userId: string) {
    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                productImages: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const ordersMapped = orders.map((order) => {
      order.orderItems.forEach((orderItem) => {
        if (orderItem.product === null) {
          orderItem.product = { productImages: [] }
        }
      })
      return PrismaOrderMapper.toDomain(order)
    })

    return { orders: ordersMapped }
  }
}
