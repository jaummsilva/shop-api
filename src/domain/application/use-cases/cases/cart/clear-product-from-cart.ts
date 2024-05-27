import { type Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { CartsRepository } from '@/domain/application/repositories/carts-repository'
import type { Cart } from '@/domain/enterprise/cart'

interface ClearProductFromCartUseCaseRequest {
  userId: string
  productId: string
}

type ClearProductFromCartUseCaseResponse = Either<
  ResourceNotFoundError,
  { cart: Cart }
>

export class ClearProductFromCartCase {
  constructor(private cartsRepository: CartsRepository) {}

  async execute({
    userId,
    productId,
  }: ClearProductFromCartUseCaseRequest): Promise<ClearProductFromCartUseCaseResponse> {
    const cart = await this.cartsRepository.findOpenCartByUser(userId)

    if (!cart) {
      return left(new ResourceNotFoundError())
    }

    await this.cartsRepository.clearProductFromCart(userId, productId)
    return right({ cart })
  }
}
