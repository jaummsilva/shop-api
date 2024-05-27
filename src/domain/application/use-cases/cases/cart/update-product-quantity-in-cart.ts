import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { CartsRepository } from '@/domain/application/repositories/carts-repository'
import type { ProductsRepository } from '@/domain/application/repositories/products-repository'
import type { Cart } from '@/domain/enterprise/cart'

import { UserAlreadyExistsError } from '../../errors/user/user-already-exists'

interface UpdateProductQuantityInCartUseCaseRequest {
  userId: string
  productId: string
  type: 'DECREMENT' | 'INCREMENT'
}

type UpdateProductQuantityInCartUseCaseResponse = Either<
  UserAlreadyExistsError,
  { cart: Cart }
>

export class UpdateProductQuantityInCartUseCase {
  constructor(
    private cartsRepository: CartsRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute({
    userId,
    productId,
    type,
  }: UpdateProductQuantityInCartUseCaseRequest): Promise<UpdateProductQuantityInCartUseCaseResponse> {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      return left(new ResourceNotFoundError())
    }

    const existsCartItem =
      await this.cartsRepository.findCartItemByProductAndUser(userId, productId)

    if (!existsCartItem) {
      return left(new ResourceNotFoundError())
    }

    if (existsCartItem) {
      if (type === 'DECREMENT') {
        existsCartItem.quantity -= 1
      } else {
        existsCartItem.quantity += 1
      }

      await this.cartsRepository.saveCartItem(existsCartItem)
    }

    const cart = await this.cartsRepository.findOpenCartByUser(userId)

    if (!cart) {
      return left(new ResourceNotFoundError())
    }
    return right({ cart })
  }
}
