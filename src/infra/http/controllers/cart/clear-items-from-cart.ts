import { fromError } from 'zod-validation-error'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import { makeClearItemsFromCartUseCase } from './factories/make-clear-items-from-cart-use-case'
import { CartsPresenter } from './presenter/cart-presenter'

export class ClearItemsFromCartController {
  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const clearItemsFromCartCase = makeClearItemsFromCartUseCase()

      const result = await clearItemsFromCartCase.execute({
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
