import fs from 'fs'
import path from 'path'
import { fromError } from 'zod-validation-error'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { Validation } from '@/core/validation/validation'
import { PATH_TEMP_FILES } from '@/paths'

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

      if (userId === request.user.sub) {
        return reply.status(400).send()
      }

      const userDeleteUsersCase = makeUserDeleteUseCase()

      const result = await userDeleteUsersCase.execute({
        userId,
      })

      if (result.isLeft()) {
        const error = result.value

        if (error instanceof ResourceNotFoundError) {
          return reply.status(409).json({
            message: error.message,
          })
        }
      }

      // Função para remover imagens antigas
      const removeFolder = (directory: string) => {
        if (fs.existsSync(directory)) {
          fs.readdirSync(directory).forEach((file) => {
            const currentPath = path.join(directory, file)
            if (fs.lstatSync(currentPath).isDirectory()) {
              // Se for um diretório, chama a função recursivamente
              removeFolder(currentPath)
            } else {
              // Se for um arquivo, remove o arquivo
              fs.unlinkSync(currentPath)
            }
          })
          // Após remover todos os arquivos, remove o diretório vazio
          fs.rmdirSync(directory)
        }
      }

      const principalDir = path.join(PATH_TEMP_FILES, userId)
      removeFolder(principalDir)

      return reply.status(204).send()
    } catch (error) {
      const validationError = fromError(error)

      return reply.status(400).json({
        message: validationError.details,
      })
    }
  }
}
