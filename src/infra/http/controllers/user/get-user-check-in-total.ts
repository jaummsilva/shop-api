import { fromError } from 'zod-validation-error'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import type { HttpServer } from '../../http-server'
import { makeGetUserCheckInTotalUseCase } from './factories/make-get-user-check-in-total-use-case'

export class GetUserCheckInTotalController {
  constructor(private httpServer: HttpServer) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const getUserCheckInTotalCase = makeGetUserCheckInTotalUseCase()

      const result = await getUserCheckInTotalCase.execute({
        userId: request.user.sub,
      })

      if (result.isLeft()) {
        return reply.status(200).json({
          total: 0,
        })
      }

      if (result.isRight()) {
        const { total } = result.value

        return reply.status(200).json({
          total,
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
