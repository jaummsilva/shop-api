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
      productImages: product.productImages.map((productImage) => ({
        imageUrl:
          `/product/${product.id.toString()}/get-image/` +
          (productImage.isPrincipal ? 'principal/' : 'optional/') +
          productImage.imageFakeName,
        isPrincipal: productImage.isPrincipal,
      })),
    }
  }
}
