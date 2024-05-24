import { fromError } from 'zod-validation-error'

import type { Validation } from '@/core/validation/validation'
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user/user-already-exists'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import type { HttpServer } from '../../http-server'
import { makeUserDeleteUseCase } from './factories/make-delete'

export class UserDeleteController {
  constructor(
    private httpServer: HttpServer,
    private bodyValidation: Validation<{
      userId: string
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const { userId } = this.bodyValidation.parse(request.params)

      const userDeleteUsersCase = makeUserDeleteUseCase()

      const result = await userDeleteUsersCase.execute({
        userId,
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
