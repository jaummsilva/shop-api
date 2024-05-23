import { fromError } from 'zod-validation-error'

import type { Validation } from '@/core/validation/validation'
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user/user-already-exists'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import type { HttpServer } from '../../http-server'
import { makeUdateStatusUseCase } from './factories/make-update-status'

export class UserUpdateStatusController {
  constructor(
    private httpServer: HttpServer,
    private bodyValidation: Validation<{
      userId: string
      status: 'S' | 'N'
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const { userId, status } = this.bodyValidation.parse(request.body)

      const userUpdateUsersCase = makeUdateStatusUseCase()

      const result = await userUpdateUsersCase.execute({
        userId,
        status,
      })

      if (result.isLeft()) {
        const error = result.value

        if (error instanceof UserAlreadyExistsError) {
          return reply.status(409).json({
            message: error.message,
          })
        }
      }

      return reply.status(204).send()
    } catch (error) {
      const validationError = fromError(error)

      return reply.status(400).json({
        message: validationError.details,
      })
    }
  }
}
