import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

import type { ProductImages } from './product-image'

type ProductProps = {
  id?: string
  name: string
  description?: string
  price: number
  createdAt?: Date
  updatedAt?: Date
  orderItems?: []
  cartItems?: []
  productImages?: ProductImages[]
}

export class Product extends Entity<ProductProps> {
  private constructor(props: ProductProps, id?: UniqueEntityID) {
    super(props, id)
  }

  static create(props: ProductProps, id?: UniqueEntityID): Product {
    const product = new Product(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return product
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get description() {
    return this.props.description
  }

  set description(description: string | undefined) {
    this.props.description = description
  }

  get price() {
    return this.props.price
  }

  set price(price: number) {
    this.props.price = price
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get orderItems() {
    return this.props.orderItems
  }

  set orderItems(orderItems: [] | undefined) {
    this.props.orderItems = orderItems
  }

  get cartItems() {
    return this.props.cartItems
  }

  set cartItems(cartItems: [] | undefined) {
    this.props.cartItems = cartItems
  }

  get productImages() {
    return this.props.productImages
  }

  set productImages(productImages: ProductImages[] | undefined) {
    this.props.productImages = productImages
  }

  assignImages(images: ProductImages[]) {
    this.props.productImages = images
  }
}
