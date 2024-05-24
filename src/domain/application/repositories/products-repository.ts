import type { Product } from '@/domain/enterprise/product'
import type { ProductImages } from '@/domain/enterprise/product-image'

import type { MetaResponse } from '../utils/meta-response'

export interface FindManyParams {
  name?: string
  page?: number
  perPage?: number
}

export interface ProductsRepository {
  create(data: Product): Promise<Product>
  createProductImage(data: ProductImages): Promise<boolean>
  update(data: Product): Promise<Product>
  findMany(
    params: FindManyParams,
  ): Promise<{ products: Product[]; meta: MetaResponse }>

  findById(productId: string): Promise<Product | null>
  delete(productId: string): Promise<boolean>
}
