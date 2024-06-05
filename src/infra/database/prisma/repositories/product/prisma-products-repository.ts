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
      include: {
        productImages: true,
      },
    })
    return PrismaProductMapper.toDomain(product)
  }

  async findById(productId: string) {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        productImages: true,
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
      include: {
        productImages: true,
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
        include: {
          productImages: true,
        },
      }),
      prisma.product.count({
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

  async findStoreMany(query: string) {
    let take

    if (query && query !== '') {
      take = undefined
    } else {
      take = 15
    }

    const [products] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
        take,
        include: {
          productImages: true,
        },
      }),
    ])

    const productsMapped = products.map((product) =>
      PrismaProductMapper.toDomain({
        ...product,
      }),
    )

    return { products: productsMapped }
  }

  async delete(productId: string) {
    await prisma.product.delete({
      where: {
        id: productId,
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

  async deleteProductImagesWherePrincipal(productId: string) {
    await prisma.productImages.deleteMany({
      where: {
        productId,
        isPrincipal: true,
      },
    })

    return true
  }

  async deleteProductImagesWhereOptional(productId: string) {
    await prisma.productImages.deleteMany({
      where: {
        productId,
        isPrincipal: false,
      },
    })

    return true
  }
}
