import type {
  FindManyParams,
  OrdersRepository,
} from '@/domain/application/repositories/orders-repository'
import type { MetaResponse } from '@/domain/application/utils/meta-response'
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

  async findMany(params: FindManyParams) {
    const { query = '', page = 1, perPage = 10 } = params

    const skip = (page - 1) * perPage
    const take = perPage

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where: {
          OR: [
            {
              userName: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              id: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
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
      }),
      prisma.order.count({
        where: {
          OR: [
            {
              userName: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              id: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
      }),
    ])

    const meta: MetaResponse = {
      pageIndex: page || 1,
      perPage,
      totalCount,
    }

    const ordersMapped = orders.map((order) => {
      order.orderItems.forEach((orderItem) => {
        if (orderItem.product === null) {
          orderItem.product = { productImages: [] }
        }
      })
      return PrismaOrderMapper.toDomain(order)
    })
    return { orders: ordersMapped, meta }
  }
}
