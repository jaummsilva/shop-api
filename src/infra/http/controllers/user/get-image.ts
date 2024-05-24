import fs from 'fs'
import path from 'path'
import { fromError } from 'zod-validation-error'

import type { Validation } from '@/core/validation/validation'
import { getImageContentType } from '@/infra/utils/image/get-imagem-content-type'
import { PATH_TEMP_FILES } from '@/paths'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'

export class GetImageUserController {
  constructor(
    private bodyValidation: Validation<{
      imageName: string
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const { imageName } = this.bodyValidation.parse(request.params)

      if (imageName) {
        const imagePath = path.join(PATH_TEMP_FILES, imageName)

        const existsImage = fs.existsSync(imagePath)
        if (!existsImage) {
          return reply.status(404)
        }

        const imageBuffer = fs.readFileSync(imagePath)

        const contentType = getImageContentType(imagePath)

        // Send the image buffer as the response
        return reply.type(contentType).send(imageBuffer)
      } else {
        return reply.status(404).json({
          message: 'Photo not found',
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
