import type { CartItem as PrismaCartItem } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CartItem as DomainCartItem } from '@/domain/enterprise/cart-item'

export class PrismaCartItemMapper {
  static toDomain(raw: PrismaCartItem): DomainCartItem {
    return DomainCartItem.create(
      {
        cartId: new UniqueEntityID(raw.cartId),
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
