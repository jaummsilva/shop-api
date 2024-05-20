import { fromError } from 'zod-validation-error'

import type { Validation } from '@/core/validation/validation'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import type { HttpServer } from '../../http-server'
import { makeFetchUserCheckInsHistoryUseCase } from './factories/make-fetch-user-check-ins-history-use-case'
import { UserCheckInsHistoryPresenter } from './presenter/user-check-ins-history-presenter'

export class FecthUserCheckInsHistoryController {
  constructor(
    private httpServer: HttpServer,
    private bodyValidation: Validation<{
      page?: number
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const { page } = this.bodyValidation.parse(request.query)
      const fecthUserCheckInsHistoryCase = makeFetchUserCheckInsHistoryUseCase()

      const result = await fecthUserCheckInsHistoryCase.execute({
        userId: request.user.sub,
        page: page || 0,
      })

      if (result.isLeft()) {
        return reply.status(409).json({
          checkIns: [],
        })
      }

      if (result.isRight()) {
        const { checkIns } = result.value

        return reply.status(200).json({
          checkIns: checkIns.map((checkIn) => ({
            ...UserCheckInsHistoryPresenter.toHttp(checkIn),
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
