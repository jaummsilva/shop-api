import fs from 'fs'
import path from 'path'
import { fromError } from 'zod-validation-error'

import type { Validation } from '@/core/validation/validation'
import { PATH_TEMP_FILES } from '@/paths'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import type { HttpServer } from '../../http-server'

export class GetImageUserController {
  constructor(
    private httpServer: HttpServer,
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

        reply.type(contentType)

        // Send the image buffer as the response
        return reply.send(imageBuffer)
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

// Helper function to determine the content type of the image
function getImageContentType(imagePath: string): string {
  const ext = path.extname(imagePath).toLowerCase()
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.png':
      return 'image/png'
    default:
      return 'application/octet-stream' // Default to binary if extension is unknown
  }
}
