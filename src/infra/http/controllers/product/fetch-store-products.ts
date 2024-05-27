import { fromError } from 'zod-validation-error'

import type { Validation } from '@/core/validation/validation'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import { makeFetchStoreProductsUseCase } from './factories/make-fetch-store-products-use-case'
import { ProductsPresenter } from './presenter/product-presenter'

export class FecthStoreProductsController {
  constructor(
    private bodyValidation: Validation<{
      query?: string
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const { query } = this.bodyValidation.parse(request.query)

      const fecthStoreProductsCase = makeFetchStoreProductsUseCase()

      const result = await fecthStoreProductsCase.execute({ query })

      if (result.isRight()) {
        const { products } = result.value

        return reply.status(200).json({
          products: products.map((product) => ({
            ...ProductsPresenter.toHttp(product),
          })),
        })
      }
    } catch (error) {
      const validationError = fromError(error)

      return reply.status(400).json({
        message: validationError.details,
      })
    }
  }
}
