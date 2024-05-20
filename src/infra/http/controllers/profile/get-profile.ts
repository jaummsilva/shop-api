import { fromError } from 'zod-validation-error'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import { makeGetProfileUseCase } from './factories/make-get-profile-use-case'
import { ProfilePresenter } from './presenter/profile-presenter'

export class ProfileController {
  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const getProfileCase = makeGetProfileUseCase()

      const result = await getProfileCase.execute({ userId: request.user.sub })

      if (result.isLeft()) {
        const error = result.value

        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).json({
            message: error.message,
          })
        }
      } else {
        return reply.status(200).json({
          user: ProfilePresenter.toHttp(result.value.user),
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
