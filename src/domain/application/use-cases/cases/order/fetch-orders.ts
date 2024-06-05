import { type Either, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { OrdersRepository } from '@/domain/application/repositories/orders-repository'
import type { MetaResponse } from '@/domain/application/utils/meta-response'
import type { Order } from '@/domain/enterprise/order'

interface FetchOrdersUseCaseRequest {
  query?: string
  page?: number
  perPage?: number
}

type FetchOrdersUseCaseResponse = Either<
  ResourceNotFoundError,
  { orders: Order[]; meta: MetaResponse }
>

export class FetchOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    query,
    page,
    perPage,
  }: FetchOrdersUseCaseRequest): Promise<FetchOrdersUseCaseResponse> {
    const { meta, orders } = await this.ordersRepository.findMany({
      page,
      query,
      perPage,
    })

    return right({ orders, meta })
  }
}
