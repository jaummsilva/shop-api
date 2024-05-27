import { fromError } from 'zod-validation-error'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { Validation } from '@/core/validation/validation'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import { makeClearProductFromCartUseCase } from './factories/make-clear-product-from-cart'
import { CartsPresenter } from './presenter/cart-presenter'

export class ClearProductFromCartController {
  constructor(
    private bodyValidation: Validation<{
      productId: string
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const { productId } = this.bodyValidation.parse(request.body)
      const clearProductFromCartCase = makeClearProductFromCartUseCase()

      const result = await clearProductFromCartCase.execute({
        productId,
        userId: request.user.sub,
      })

      if (result.isLeft()) {
        const error = result.value

        if (error instanceof ResourceNotFoundError) {
          return reply.status(400).json({
            message: error.message,
          })
        }
      }
      if (result.isRight()) {
        return reply
          .status(200)
          .send()
          .json(CartsPresenter.toHttp(result.value.cart))
      }
    } catch (error) {
      const validationError = fromError(error)

      return reply.status(400).json({
        message: validationError.details,
      })
    }
  }
}
