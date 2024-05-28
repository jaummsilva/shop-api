import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

import type { OrderItem } from './order-item'

type OrderProps = {
  createdAt?: Date
  totalPrice: number
  userId?: UniqueEntityID
  orderItems: OrderItem[]
}

export class Order extends Entity<OrderProps> {
  private constructor(props: OrderProps, id?: UniqueEntityID) {
    super(props, id)
  }

  static create(props: OrderProps, id?: UniqueEntityID): Order {
    const order = new Order(props, id)
    return order
  }

  get createdAt() {
    return this.props.createdAt
  }

  get totalPrice() {
    return this.props.totalPrice
  }

  set totalPrice(totalPrice: number) {
    this.props.totalPrice = totalPrice
  }

  get userId() {
    return this.props.userId
  }

  get orderItems() {
    return this.props.orderItems
  }

  set orderItems(orderItems: OrderItem[]) {
    this.props.orderItems = orderItems
  }
}
