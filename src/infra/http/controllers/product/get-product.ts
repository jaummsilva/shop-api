import { fromError } from 'zod-validation-error'

import type { Validation } from '@/core/validation/validation'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import { makeGetProductUseCase } from './factories/make-get-product-use-case'
import { ProductsPresenter } from './presenter/product-presenter'

export class GetProductController {
  constructor(
    private bodyValidation: Validation<{
      productId: string
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const { productId } = this.bodyValidation.parse(request.params)

      const getProductCase = makeGetProductUseCase()

      const result = await getProductCase.execute({ productId })

      if (result.isRight()) {
        const { product } = result.value

        return reply.status(200).json(ProductsPresenter.toHttp(product))
      }
    } catch (error) {
      const validationError = fromError(error)

      return reply.status(400).json({
        message: validationError.details,
      })
    }
  }
}
