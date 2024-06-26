import type { CartsRepository } from '@/domain/application/repositories/carts-repository'
import type { Cart } from '@/domain/enterprise/cart'
import type { CartItem } from '@/domain/enterprise/cart-item'
import { prisma } from '@/infra/database/prisma/prisma'

import { PrismaCartMapper } from '../../mappers/prisma-cart.mapper'
import { PrismaCartItemMapper } from '../../mappers/prisma-cart-item.mapper'

export class PrismaCartsRepository implements CartsRepository {
  async create(data: Cart): Promise<Cart> {
    const cart = await prisma.cart.create({
      data: {
        status: data.status,
        userId: data.userId ? data.userId.toString() : null,
        userName: data.userName ? data.userName : null,
        cartItems: {
          create: data.cartItems.map((cartItem) => ({
            id: cartItem.id.toString(),
            productId: cartItem.productId
              ? cartItem.productId.toString()
              : null,
            quantity: cartItem.quantity,
            productName: cartItem.productName,
          })),
        },
      },
      include: {
        cartItems: true,
      },
    })
    return PrismaCartMapper.toDomain(cart)
  }

  async createCartItem(data: CartItem) {
    const cartItem = await prisma.cartItem.create({
      data: {
        quantity: data.quantity,
        cartId: data.cartId.toString(),
        productId: data.productId ? data.productId.toString() : null,
        productName: data.productName,
      },
    })

    if (!cartItem) {
      return false
    }
    return true
  }

  async save(data: Cart) {
    const cart = await prisma.cart.update({
      where: { id: data.id.toString() },
      data: {
        status: data.status,
      },
      include: {
        cartItems: true,
      },
    })

    return PrismaCartMapper.toDomain(cart)
  }

  async findCartItemByProductAndUser(userId: string, productId: string) {
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        productId,
        cart: {
          userId,
          status: 'ABERTO',
        },
      },
    })

    if (!cartItem) {
      return null
    }

    return PrismaCartItemMapper.toDomain(cartItem)
  }

  async saveCartItem(data: CartItem) {
    await prisma.cartItem.update({
      where: { id: data.id.toString() },
      data: {
        quantity: data.quantity,
      },
    })
  }

  async findById(cartId: string) {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        cartItems: true,
      },
    })

    if (!cart) {
      return null
    }

    return PrismaCartMapper.toDomain(cart)
  }

  async findOpenCartByUser(userId: string) {
    const cart = await prisma.cart.findFirst({
      where: {
        userId,
        status: 'ABERTO',
      },
      include: {
        cartItems: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            product: true,
          },
        },
      },
    })

    if (!cart) {
      return null
    }

    // Calculate total price
    const totalPrice = cart.cartItems.reduce((total, cartItem) => {
      // Convert Decimal to number
      if (cartItem.product) {
        const price = cartItem.product.price.toNumber()
        return total + price * cartItem.quantity
      }
      return total
    }, 0)

    const cartMapped = PrismaCartMapper.toDomain({
      ...cart,
      totalItems: cart.cartItems.length,
      totalPrice,
    })

    return cartMapped
  }

  async clearItemsFromCart(userId: string) {
    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId,
          status: 'ABERTO',
        },
      },
    })
    return true
  }

  async clearProductFromCart(userId: string, productId: string) {
    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId,
          status: 'ABERTO',
        },
        productId,
      },
    })
    return true
  }
}
