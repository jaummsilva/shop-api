import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

type ProductImagesProps = {
  id?: string
  imageOriginalName: string
  imageFakeName: string
  imageType: string
  productId: string
  isPrincipal: boolean
}

export class ProductImages extends Entity<ProductImagesProps> {
  private constructor(props: ProductImagesProps, id?: UniqueEntityID) {
    super(props, id)
  }

  static create(props: ProductImagesProps, id?: UniqueEntityID): ProductImages {
    return new ProductImages(props, id)
  }

  get imageOriginalName() {
    return this.props.imageOriginalName
  }

  get imageFakeName() {
    return this.props.imageFakeName
  }

  get imageType() {
    return this.props.imageType
  }

  get productId() {
    return this.props.productId
  }

  get isPrincipal() {
    return this.props.isPrincipal
  }
}
