import type { Product as PrismaProduct } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Product as DomainProduct } from '@/domain/enterprise/product'

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct): DomainProduct {
    return DomainProduct.create(
      {
        id: raw.id,
        name: raw.name,
        description: raw.description !== null ? raw.description : undefined,
        price: Number(raw.price),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
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
