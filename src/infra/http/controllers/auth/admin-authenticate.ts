import { fromError } from 'zod-validation-error'

import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import type { Validation } from '@/core/validation/validation'
import { UserNotExistsError } from '@/domain/application/use-cases/errors/user/user-not-exists'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import type { HttpServer } from '../../http-server'
import { makeAdminAuthenticateUseCase } from './factories/make-admin-authenticate-use-case'

export class AdminAuthenticateController {
  constructor(
    private httpServer: HttpServer,
    private bodyValidation: Validation<{
      email: string
      password: string
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const { email, password } = this.bodyValidation.parse(request.body)

      const authenticateUsersCase = makeAdminAuthenticateUseCase()

      const result = await authenticateUsersCase.execute({ email, password })

      if (result.isLeft()) {
        const error = result.value

        if (error instanceof UserNotExistsError) {
          return reply.status(409).json({
            message: error.message,
          })
        }

        if (error instanceof UnauthorizedError) {
          return reply.status(401).json({
            message: error,
          })
        }
      } else {
        const { user } = result.value

        const { token, refreshToken } = this.httpServer.signJwt(
          user.id.toString(),
          user.role,
        )

        return reply
          .setCookie('refreshToken', refreshToken, {
            path: '/',
            secure: true,
            sameSite: true,
            httpOnly: true,
          })
          .status(200)
          .json({
            token,
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
