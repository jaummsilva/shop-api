import { fromError } from 'zod-validation-error'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { Validation } from '@/core/validation/validation'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import { makeUpdateProductQuantityInCartUseCase } from './factories/make-update-product-quantity-in-cart-use-case'
import { CartsPresenter } from './presenter/cart-presenter'

export class UpdateProductQuantityInCartController {
  constructor(
    private bodyValidation: Validation<{
      productId: string
      type: 'DECREMENT' | 'INCREMENT'
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const { productId, type } = this.bodyValidation.parse(request.body)

      const updateProductQuantityInCartCase =
        makeUpdateProductQuantityInCartUseCase()

      const result = await updateProductQuantityInCartCase.execute({
        userId: request.user.sub,
        productId,
        type,
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
