import { fromError } from 'zod-validation-error'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import { makeOrdersRegisterUseCase } from './factories/make-orders-register-use-case'

export class OrderRegisterController {
  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const productDeleteCase = makeOrdersRegisterUseCase()

      const result = await productDeleteCase.execute({
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
        return reply.status(201).json({
          orderId: result.value.order.id.toString(),
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
