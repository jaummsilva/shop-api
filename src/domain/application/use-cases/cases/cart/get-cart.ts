import { type Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { CartsRepository } from '@/domain/application/repositories/carts-repository'
import type { Cart } from '@/domain/enterprise/cart'

interface GetCartUseCaseRequest {
  userId: string
}

type GetCartUseCaseResponse = Either<ResourceNotFoundError, { cart: Cart }>

export class GetCartUseCase {
  constructor(private cartsRepository: CartsRepository) {}

  async execute({
    userId,
  }: GetCartUseCaseRequest): Promise<GetCartUseCaseResponse> {
    const cart = await this.cartsRepository.findOpenCartByUser(userId)

    if (!cart) {
      return left(new ResourceNotFoundError())
    }

    return right({ cart })
  }
}
