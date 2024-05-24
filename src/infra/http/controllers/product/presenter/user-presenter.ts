import type { Product } from '@/domain/enterprise/product'

export class ProductsPresenter {
  static toHttp(product: Product) {
    return {
      id: product.id.toString(),
      name: product.name,
      description: product.description ?? '',
      price: product.price,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }
  }
}
