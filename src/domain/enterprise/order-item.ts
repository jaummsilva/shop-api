import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

type OrderItemProps = {
  orderId: UniqueEntityID
  productId?: UniqueEntityID
  quantity: number
  productPrice: number
  productName: string
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

  get orderId() {
    return this.props.orderId
  }

  get productName() {
    return this.props.productName
  }

  set productName(productName: string) {
    this.props.productName = productName
  }

  get productId() {
    return this.props.productId
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
