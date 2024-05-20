import { fromError } from 'zod-validation-error'

import type { Validation } from '@/core/validation/validation'
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user/user-already-exists'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import type { HttpServer } from '../../http-server'
import { makeRegisterUseCase } from './factories/make-register-use-case'

export class UserController {
  constructor(
    private httpServer: HttpServer,
    private bodyValidation: Validation<{
      email: string
      password: string
      name: string
      role: 'ADMIN' | 'MEMBER'
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const { name, email, password, role } = this.bodyValidation.parse(
        request.body,
      )

      const userRegisterUsersCase = makeRegisterUseCase()

      const result = await userRegisterUsersCase.execute({
        name,
        email,
        password,
        role,
      })

      if (result.isLeft()) {
        const error = result.value

        if (error instanceof UserAlreadyExistsError) {
          return reply.status(409).json({
            message: error.message,
          })
        }
      }

      return reply.status(201).send()
    } catch (error) {
      const validationError = fromError(error)

      return reply.status(400).json({
        message: validationError.details,
      })
    }
  }
}
