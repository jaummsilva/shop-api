import type { OrderItem } from '@prisma/client'

import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

import type { User } from './user'

type OrderProps = {
  id?: string
  createdAt?: Date
  totalPrice: number
  user: User
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

  get user() {
    return this.props.user
  }

  set user(user: User) {
    this.props.user = user
  }

  get orderItems() {
    return this.props.orderItems
  }

  set orderItems(orderItems: OrderItem[]) {
    this.props.orderItems = orderItems
  }
}
