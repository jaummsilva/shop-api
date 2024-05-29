import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

import type { CartItem } from './cart-item'

export enum StatusCart {
  ABERTO = 'ABERTO',
  FECHADO = 'FECHADO',
}

type CartProps = {
  userId?: UniqueEntityID
  userName?: string
  cartItems: CartItem[]
  status: StatusCart
  totalItems: number
  totalPrice: number
}

export class Cart extends Entity<CartProps> {
  private constructor(props: CartProps, id?: UniqueEntityID) {
    super(props, id)
  }

  static create(props: CartProps, id?: UniqueEntityID): Cart {
    const cart = new Cart(
      {
        ...props,
      },
      id,
    )

    return cart
  }

  get userId() {
    return this.props.userId
  }

  get totalPrice() {
    return this.props.totalPrice
  }

  get totalItems() {
    return this.props.totalItems
  }

  get cartItems() {
    return this.props.cartItems
  }

  set cartItems(cartItems: CartItem[]) {
    this.props.cartItems = cartItems
  }

  get status() {
    return this.props.status
  }

  set status(status: StatusCart) {
    this.props.status = status
  }

  get userName() {
    return this.props.userName
  }
}
