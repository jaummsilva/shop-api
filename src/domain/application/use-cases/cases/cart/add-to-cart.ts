import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { CartsRepository } from '@/domain/application/repositories/carts-repository'
import type { ProductsRepository } from '@/domain/application/repositories/products-repository'
import { Cart, StatusCart } from '@/domain/enterprise/cart'
import { CartItem } from '@/domain/enterprise/cart-item'

interface AddToCartUseCaseRequest {
  userId: string
  productId: string
  quantity: number
}

type AddToCartUseCaseResponse = Either<ResourceNotFoundError, { cart: Cart }>

export class AddToCartUseCase {
  constructor(
    private cartsRepository: CartsRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute({
    userId,
    productId,
    quantity,
  }: AddToCartUseCaseRequest): Promise<AddToCartUseCaseResponse> {
    try {
      const product = await this.productsRepository.findById(productId)

      if (!product) {
        return left(new ResourceNotFoundError())
      }

      let cart = await this.cartsRepository.findOpenCartByUser(userId)

      if (!cart) {
        const cartCreated = Cart.create({
          status: StatusCart.ABERTO,
          userId: new UniqueEntityID(userId),
          totalItems: 0,
          totalPrice: 0,
          cartItems: [],
        })

        cart = await this.cartsRepository.create(cartCreated)

        const cartItem = CartItem.create({
          cartId: cart.id,
          productId: new UniqueEntityID(productId),
          quantity,
        })

        await this.cartsRepository.createCartItem(cartItem)
      }

      const existingItemIndex = cart.cartItems.findIndex(
        (item) => item.productId.toString() === productId,
      )

      if (existingItemIndex !== -1) {
        const existsCartItem =
          await this.cartsRepository.findCartItemByProductAndUser(
            userId,
            productId,
          )

        if (existsCartItem) {
          existsCartItem.quantity += quantity

          await this.cartsRepository.saveCartItem(existsCartItem)
        }
      } else {
        const newCartItem = CartItem.create({
          cartId: cart.id,
          productId: product.id,
          quantity,
        })

        await this.cartsRepository.createCartItem(newCartItem)
      }

      return right({ cart })
    } catch (error) {
      return left(new ResourceNotFoundError())
    }
  }
}
