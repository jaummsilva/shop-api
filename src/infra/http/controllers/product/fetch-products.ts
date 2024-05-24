import { fromError } from 'zod-validation-error'

import type { Validation } from '@/core/validation/validation'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import { makeFetchProductsUseCase } from './factories/make-fetch-products-use-case'
import { ProductsPresenter } from './presenter/user-presenter'
export class FecthProductsController {
  constructor(
    private bodyValidation: Validation<{
      name?: string
      page?: number
      perPage?: number
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const { name, page, perPage } = this.bodyValidation.parse(request.query)

      const fecthProductsCase = makeFetchProductsUseCase()

      const result = await fecthProductsCase.execute({ name, page, perPage })

      if (result.isRight()) {
        const { products, meta } = result.value

        return reply.status(200).json({
          products: products.map((product) => ({
            ...ProductsPresenter.toHttp(product),
          })),
          meta,
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
