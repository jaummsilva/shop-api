import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { CartsRepository } from '@/domain/application/repositories/carts-repository'
import type { OrdersRepository } from '@/domain/application/repositories/orders-repository'
import type { ProductsRepository } from '@/domain/application/repositories/products-repository'
import type { UsersRepository } from "@/domain/application/repositories/users-repository'"
import { StatusCart } from '@/domain/enterprise/cart'
import { Order } from '@/domain/enterprise/order'
import { OrderItem } from '@/domain/enterprise/order-item'
import type { User } from '@/domain/enterprise/user'

interface OrderRegisterUseCaseRequest {
  userId: string
}

type OrderRegisterUseCaseResponse = Either<
  ResourceNotFoundError,
  { order: Order; users: User[] }
>

export class OrderRegisterUseCase {
  constructor(
    private cartsRepository: CartsRepository,
    private orderRepository: OrdersRepository,
    private productsRepository: ProductsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
  }: OrderRegisterUseCaseRequest): Promise<OrderRegisterUseCaseResponse> {
    try {
      const cart = await this.cartsRepository.findOpenCartByUser(userId)

      if (!cart || cart.status !== StatusCart.ABERTO) {
        return left(new ResourceNotFoundError())
      }

      const orderId = new UniqueEntityID()
      const orderItems: OrderItem[] = []
      let totalPrice = 0

      for (const cartItem of cart.cartItems) {
        // Fetch product details including price
        if (cartItem.productId) {
          const product = await this.productsRepository.findById(
            cartItem.productId.toString(),
          )
          if (!product) {
            return left(new ResourceNotFoundError())
          }

          const orderItem = OrderItem.create({
            orderId,
            productId: cartItem.productId
              ? new UniqueEntityID(cartItem.productId.toString())
              : undefined,
            quantity: cartItem.quantity,
            productPrice: product.price,
            productName: product.name,
            totalPrice: product.price * cartItem.quantity,
          })
          orderItems.push(orderItem)
          totalPrice += orderItem.totalPrice
        }
      }

      const user = await this.usersRepository.findById(userId)
      const order = Order.create(
        {
          userId: new UniqueEntityID(userId),
          totalPrice,
          orderItems,
          createdAt: new Date(),
          userName: user?.name,
        },
        orderId,
      )

      await this.orderRepository.create(order)

      cart.status = StatusCart.FECHADO

      await this.cartsRepository.save(cart)

      const users = await this.usersRepository.getByAdmin()

      return right({ order, users })
    } catch (error) {
      return left(new ResourceNotFoundError())
    }
  }
}
