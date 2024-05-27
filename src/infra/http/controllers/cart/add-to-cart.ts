import { fromError } from 'zod-validation-error'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { Validation } from '@/core/validation/validation'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import { makeAddToCartUseCase } from './factories/make-add-to-cart-use-case'
import { CartsPresenter } from './presenter/cart-presenter'

export class AddToCartController {
  constructor(
    private bodyValidation: Validation<{
      productId: string
      quantity: number
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const { productId, quantity } = this.bodyValidation.parse(request.body)

      const productDeleteCase = makeAddToCartUseCase()

      const result = await productDeleteCase.execute({
        userId: request.user.sub,
        productId,
        quantity,
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
          .status(204)
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
