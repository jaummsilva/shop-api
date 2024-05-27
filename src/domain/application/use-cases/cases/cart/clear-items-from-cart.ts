import { type Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { CartsRepository } from '@/domain/application/repositories/carts-repository'
import type { Cart } from '@/domain/enterprise/cart'

interface ClearItemsFromCartUseCaseRequest {
  userId: string
}

type ClearItemsFromCartUseCaseResponse = Either<
  ResourceNotFoundError,
  { cart: Cart }
>

export class ClearItemsFromCartCase {
  constructor(private cartsRepository: CartsRepository) {}

  async execute({
    userId,
  }: ClearItemsFromCartUseCaseRequest): Promise<ClearItemsFromCartUseCaseResponse> {
    const cart = await this.cartsRepository.findOpenCartByUser(userId)

    if (!cart) {
      return left(new ResourceNotFoundError())
    }

    await this.cartsRepository.clearItemsFromCart(userId)
    return right({ cart })
  }
}
