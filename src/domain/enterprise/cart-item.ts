import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

type CartItemProps = {
  cartId: UniqueEntityID
  productId?: UniqueEntityID
  quantity: number
  productName: string
}

export class CartItem extends Entity<CartItemProps> {
  private constructor(props: CartItemProps, id?: UniqueEntityID) {
    super(props, id)
  }

  static create(props: CartItemProps, id?: UniqueEntityID): CartItem {
    const cartItem = new CartItem(
      {
        ...props,
      },
      id,
    )

    return cartItem
  }

  get productName() {
    return this.props.productName
  }

  set productName(productName: string) {
    this.props.productName = productName
  }

  get cartId() {
    return this.props.cartId
  }

  get productId() {
    return this.props.productId
  }

  set productId(productId: UniqueEntityID | undefined) {
    this.props.productId = productId
  }

  get quantity() {
    return this.props.quantity
  }

  set quantity(quantity: number) {
    this.props.quantity = quantity
  }
}
