import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

import type { Order } from './order'
import type { Product } from './product'

type OrderItemProps = {
  id?: string
  order: Order
  product: Product
  quantity: number
  productPrice: number
  totalPrice: number
}

export class OrderItem extends Entity<OrderItemProps> {
  private constructor(props: OrderItemProps, id?: UniqueEntityID) {
    super(props, id)
  }

  static create(props: OrderItemProps, id?: UniqueEntityID): OrderItem {
    const orderItem = new OrderItem(props, id)
    return orderItem
  }

  get order() {
    return this.props.order
  }

  set order(order: Order) {
    this.props.order = order
  }

  get product() {
    return this.props.product
  }

  set product(product: Product) {
    this.props.product = product
  }

  get quantity() {
    return this.props.quantity
  }

  set quantity(quantity: number) {
    this.props.quantity = quantity
  }

  get productPrice() {
    return this.props.productPrice
  }

  set productPrice(productPrice: number) {
    this.props.productPrice = productPrice
  }

  get totalPrice() {
    return this.props.totalPrice
  }

  set totalPrice(totalPrice: number) {
    this.props.totalPrice = totalPrice
  }
}
