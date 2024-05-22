import { fromError } from 'zod-validation-error'

import type { Validation } from '@/core/validation/validation'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import type { HttpServer } from '../../http-server'
import { makeFetchUsersUseCase } from './factories/make-fetch-users-use-case'
import { UsersPresenter } from './presenter/user-presenter'
export class FecthUsersController {
  constructor(
    private httpServer: HttpServer,
    private bodyValidation: Validation<{
      name?: string
      page?: number
      perPage?: number
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const { name, page, perPage } = this.bodyValidation.parse(request.query)

      const fecthUsersCase = makeFetchUsersUseCase()

      const result = await fecthUsersCase.execute({ name, page, perPage })

      if (result.isRight()) {
        const { users, meta } = result.value

        return reply.status(200).json({
          users: users.map((user) => ({
            ...UsersPresenter.toHttp(user),
          })),
          meta,
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
