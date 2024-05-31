import type {
  Cart as PrismaCart,
  CartItem as PrismaCartItem,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Cart as DomainCart } from '@/domain/enterprise/cart'
import { CartItem as DomainCartItems } from '@/domain/enterprise/cart-item'

import { mapPrismaStatusToDomainStatus } from './prisma-status-cart.mapper'

export class PrismaCartMapper {
  static toDomain(
    raw: PrismaCart & {
      cartItems: PrismaCartItem[]
      totalItems?: number
      totalPrice?: number
    },
  ): DomainCart {
    return DomainCart.create(
      {
        status: mapPrismaStatusToDomainStatus(raw.status),
        userId: raw.userId ? new UniqueEntityID(raw.userId) : undefined,
        userName: raw.userName ? raw.userName : undefined,
        totalItems: raw.totalItems ?? 0,
        totalPrice: raw.totalPrice ?? 0,
        cartItems: raw.cartItems.map((cartItem) =>
          DomainCartItems.create(
            {
              cartId: new UniqueEntityID(cartItem.cartId),
              productId: cartItem.productId
                ? new UniqueEntityID(cartItem.productId)
                : undefined,
              quantity: cartItem.quantity,
              productName: cartItem.productName,
            },
            new UniqueEntityID(raw.id),
          ),
        ),
      },
      new UniqueEntityID(raw.id),
    )
  }
}
