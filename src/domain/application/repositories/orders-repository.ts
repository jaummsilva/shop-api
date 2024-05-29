import type { Order } from '@/domain/enterprise/order'

export interface OrdersRepository {
  create(data: Order): Promise<Order>
}