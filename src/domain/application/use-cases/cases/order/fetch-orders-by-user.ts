import { type Either, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { OrdersRepository } from '@/domain/application/repositories/orders-repository'
import type { Order } from '@/domain/enterprise/order'

interface FetchOrdersByUserUseCaseRequest {
  userId: string
}

type FetchOrdersByUserUseCaseResponse = Either<
  ResourceNotFoundError,
  { orders: Order[] }
>

export class FetchOrdersByUserUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    userId,
  }: FetchOrdersByUserUseCaseRequest): Promise<FetchOrdersByUserUseCaseResponse> {
    const orders = await this.ordersRepository.findManyByUser(userId)

    return right(orders)
  }
}
