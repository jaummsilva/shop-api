import type { Order } from '@/domain/enterprise/order'

import type { MetaResponse } from '../utils/meta-response'

export interface FindManyParams {
  query?: string
  page?: number
  perPage?: number
}

export interface OrdersRepository {
  create(data: Order): Promise<Order>
  findManyByUser(userId: string): Promise<{ orders: Order[] }>
  findMany(
    params: FindManyParams,
  ): Promise<{ orders: Order[]; meta: MetaResponse }>
}
