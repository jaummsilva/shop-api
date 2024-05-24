import type { ProductsRepository } from '@/domain/application/repositories/products-repository'
import type { FindManyParams } from "@/domain/application/repositories/users-repository'"
import type { MetaResponse } from '@/domain/application/utils/meta-response'
import type { Product } from '@/domain/enterprise/product'
import type { ProductImages } from '@/domain/enterprise/product-image'
import { prisma } from '@/infra/database/prisma/prisma'

import { PrismaProductMapper } from '../../mappers/prisma-product-mapper'

export class PrismaProductsRepository implements ProductsRepository {
  async create(data: Product) {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        createdAt: data.createdAt,
        price: data.price,
      },
    })
    return PrismaProductMapper.toDomain(product)
  }

  async findById(productId: string) {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    })
    if (!product) {
      return null
    }
    return PrismaProductMapper.toDomain(product)
  }

  async update(data: Product) {
    const product = await prisma.product.update({
      where: {
        id: data.id.toString(),
      },
      data: {
        name: data.name,
        description: data.description,
        createdAt: data.createdAt,
        price: data.price,
      },
    })
    return PrismaProductMapper.toDomain(product)
  }

  async findMany(params: FindManyParams) {
    const { name = '', page = 1, perPage = 10 } = params

    const skip = (page - 1) * perPage
    const take = perPage

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            {
              name: {
                contains: name,
                mode: 'insensitive',
              },
            },
          ],
        },
        skip,
        take,
      }),
      prisma.user.count({
        where: {
          OR: [
            {
              name: {
                contains: name,
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

    const productsMapped = products.map((product) =>
      PrismaProductMapper.toDomain({
        ...product,
      }),
    )
    return { products: productsMapped, meta }
  }

  async delete(userId: string) {
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    await prisma.user.delete({
      where: {
        id: userId,
      },
    })

    return true
  }

  async createProductImage(data: ProductImages) {
    try {
      await prisma.productImages.create({
        data: {
          imageFakeName: data.imageFakeName,
          imageOriginalName: data.imageOriginalName,
          isPrincipal: data.isPrincipal,
          imageType: data.imageType,
          productId: data.productId,
        },
      })
      return true
    } catch (error) {
      return false
    }
  }
}
