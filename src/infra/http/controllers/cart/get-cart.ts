import { fromError } from 'zod-validation-error'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import { makeGetCartUseCase } from './factories/make-get-cart-use-case'
import { CartsPresenter } from './presenter/cart-presenter'

export class GetCartController {
  constructor() {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const getCartCase = makeGetCartUseCase()

      const result = await getCartCase.execute({ userId: request.user.sub })

      if (result.isLeft()) {
        return reply.status(200).send()
      }

      if (result.isRight()) {
        return reply.status(200).json(CartsPresenter.toHttp(result.value.cart))
      }
    } catch (error) {
      const validationError = fromError(error)

      return reply.status(400).json({
        message: validationError.details,
      })
    }
  }
}
